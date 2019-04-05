import { action, observable, computed, runInAction, flow } from 'mobx'
import { RootStore } from '../../Store'
import * as Storage from '../../Storage'
import { MachineInfo } from './models'
import { AxiosInstance } from 'axios'
import uuidv1 from 'uuid/v1'
import { Config } from '../../config'

const getMachineInfo = 'get-machine-info'
const setMachineInfo = 'set-machine-info'
const runStatus = 'run-status'
const minimize = 'minimize-window'
const maximize = 'maximize-window'
const close = 'close-window'
const start = 'start-salad'
const stop = 'stop-salad'

const compatibilityKey = 'SKIPPED_COMPAT_CHECK'

declare global {
  interface Window {
    salad: {
      platform: string
      apiVersion: number
      dispatch: (type: string, payload: any) => void
      onNative: (args: { type: string; payload: any }) => void
    }
  }
}

export class NativeStore {
  private callbacks = new Map<string, Function>()

  private runningHeartbeat?: NodeJS.Timeout

  @observable
  public isOnline: boolean = false

  @observable
  public isRunning: boolean = false

  @observable
  public skippedCompatCheck: boolean = false

  @observable
  public loadingMachineInfo: boolean = false

  @observable
  public validOperatingSystem: boolean = false

  @observable
  public validGPUs: boolean = false

  @observable
  public machineInfo?: MachineInfo

  @computed
  get isNative(): boolean {
    return window.salad && window.salad.platform === 'electron'
  }

  @computed
  get isCompatible(): boolean {
    return this.isNative && this.validOperatingSystem && this.validGPUs
  }

  @computed
  get machineId(): string {
    return this.machineInfo !== undefined
      ? this.machineInfo.system.uuid.substr(0, 15) //TODO: Remove the substring once we update the db scheme
      : Storage.getOrSetDefaultCallback('INSTALL_ID', uuidv1).substr(0, 15) //TODO: Remove the substring once we update the db scheme
  }

  @computed
  get gpuNames(): string[] | undefined {
    if (this.machineInfo === undefined) return this.machineInfo

    return this.machineInfo.gpus.map(x => x.model)
  }

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {
    window.addEventListener('online', () => this.setOnlineStatus(true))
    window.addEventListener('offline', () => this.setOnlineStatus(false))
    this.setOnlineStatus(navigator.onLine)

    runInAction(() => {
      this.skippedCompatCheck = Storage.getOrSetDefault(compatibilityKey, 'false') === 'true'
    })

    console.log('Initial compat check: ' + this.skippedCompatCheck)

    if (this.isNative) {
      window.salad.onNative = this.onNative

      this.on(runStatus, (status: boolean) => {
        console.log('Received run status: ' + status)
        this.setRunStatus(status)
      })

      this.on(setMachineInfo, (info: MachineInfo) => {
        this.setMachineInfo(info)
      })
    }
  }

  /** Callback function when the app receives a message from native code */
  private onNative = (args: { type: string; payload: any }) => {
    let func = this.callbacks.get(args.type)

    if (func) {
      console.log('Received message ' + args.type)
      func(args.payload)
    } else {
      console.log('Recevied unhandled message type ' + args.type)
    }
  }

  /** Registers a callback to listen for native messages */
  public on = (type: string, listener: Function) => {
    this.callbacks.set(type, listener)
  }

  /** Sends a message to the native code */
  public send = (type: string, payload?: any) => {
    if (!this.isNative) {
      console.warn('Unable to send. Not running in electron env.')
      return
    }
    console.log(`Sending ${type} to native with ${payload}`)
    window.salad.dispatch(type, payload)
  }

  @action
  private setOnlineStatus = (status: boolean) => {
    console.log('Online status updated: ' + status)
    this.isOnline = status
  }

  @action
  setRunStatus = (status: boolean) => {
    this.isRunning = status

    if (this.runningHeartbeat) {
      clearInterval(this.runningHeartbeat)
    }

    if (status) {
      //Send the initial heartbeat
      this.sendRunningStatus(true)

      //Schedule future heartbeats
      this.runningHeartbeat = setInterval(() => {
        this.sendRunningStatus(true)
      }, Config.statusHearbeatRate)
    } else {
      this.sendRunningStatus(false)
    }
  }

  @action
  loadMachineInfo = () => {
    if (this.machineInfo || this.loadingMachineInfo) {
      console.log('Machine info already loaded. Skipping...')
      return
    }
    this.loadingMachineInfo = true
    this.send(getMachineInfo)
  }

  @action
  minimizeWindow = () => {
    this.send(minimize)
  }

  @action
  maximizeWindow = () => {
    this.send(maximize)
  }

  @action
  closeWindow = () => {
    this.send(close)
  }

  @action
  start = () => {
    if (!this.isCompatible) {
      throw new Error('Incompatible machine. Cannot start.')
    }

    if (this.isRunning) {
      console.warn('Already running. Skipping...')
      return
    }

    this.send(start, this.machineId)
  }

  @action
  stop = () => {
    if (!this.isCompatible) {
      throw new Error('Incompatible machine. Cannot stop.')
    }

    if (!this.isRunning) {
      console.warn('Nothing is running. Skipping...')
      return
    }

    this.send(stop)
  }

  @action
  toggleRunning = () => {
    if (this.isRunning) {
      this.stop()
    } else {
      this.start()
    }
  }

  @action.bound
  registerMachine = flow(function*(this: NativeStore) {
    if (!this.machineInfo) {
      console.warn('No valid machine info found. Unable to register.')
      return
    }

    let deviceInfo = {
      os: `${this.machineInfo.os.distro}-${this.machineInfo.os.release}`,
      gpu: this.gpuNames && this.gpuNames.join(), //TODO, change this to be just an array
      gpuDriver: 'undefined',
      macAddress: this.machineId,
      isAmdGpu: false, //TODO: can this be removed?
    }

    try {
      console.log('Registering machine with salad')
      let res = yield this.axios.post('register-machine', deviceInfo)
      console.log(res)
    } catch (err) {
      throw err
    }
  })

  @action.bound
  setMachineInfo = flow(function*(this: NativeStore, info: MachineInfo) {
    console.log('Received machine info')
    if (this.machineInfo) {
      console.log('Already receved machine info. Skipping...')
      return
    }

    this.machineInfo = info

    //TODO: Fire off the API call to get the earning rate/GPU and determine if this machine is valid
    yield this.sleep(2000)

    this.validGPUs = true

    this.validOperatingSystem =
      info.os.platform === 'win32' && (info.os.release.startsWith('10.') || info.os.release.startsWith('6.1'))

    console.log(`Validing machine. OS:${this.validOperatingSystem}, GPUs ${this.validGPUs}`)

    this.skippedCompatCheck = this.validOperatingSystem && this.validGPUs

    this.loadingMachineInfo = false

    this.store.routing.replace('/')
  })

  @action.bound
  sendRunningStatus = flow(function*(this: NativeStore, status: boolean) {
    console.log('Status MachineId' + this.machineId)

    let req = {
      macAddress: this.machineId,
      online: status,
    }
    yield this.axios.post('update-worker-status', req)
  })

  @action
  skipCompatibility = () => {
    console.log('Updating compatibility check')

    this.skippedCompatCheck = true

    Storage.setItem(compatibilityKey, 'true')

    this.store.routing.replace('/')
  }

  sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
