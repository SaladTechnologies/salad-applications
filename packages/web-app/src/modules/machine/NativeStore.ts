import { action, observable, computed, runInAction, flow } from 'mobx'
import { RootStore } from '../../Store'
import * as Storage from '../../Storage'
import { MachineInfo } from './models'
import { AxiosInstance } from 'axios'
import uuidv1 from 'uuid/v1'
import { Config } from '../../config'
import { GPUDetailsResource } from './models/GPUDetailsResource'
import { Processes, Process, Services } from './models/Processes'
import { Blacklist } from './models/Blacklist'
import * as SmartStartStorage from '../smart-start/SmartStartStorage'

const getMachineInfo = 'get-machine-info'
const setMachineInfo = 'set-machine-info'
const runStatus = 'run-status'
const runError = 'run-error'
const minimize = 'minimize-window'
const maximize = 'maximize-window'
const close = 'close-window'
const start = 'start-salad'
const stop = 'stop-salad'
const getMachineProcesses = 'get-machine-processes'
const setMachineProcesses = 'set-machine-processes'
const getMachineProcess = 'get-machine-process'
const setMachineProcess = 'set-machine-process'
const getMachineProcessRunning = 'get-machine-process-running'
const setMachineProcessRunning = 'set-machine-process-running'

const compatibilityKey = 'SKIPPED_COMPAT_CHECK'

const _BLACKLIST = 'BLACKLIST'

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
  public isOnline: boolean = true

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

  @observable
  public processes?: Processes

  @observable
  public process?: Process

  @observable
  public services?: Services[]

  @observable
  public isProcessRunning?: boolean

  @observable
  public blacklist?: Blacklist[]

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
      ? this.machineInfo.macAddress
      : Storage.getOrSetDefaultCallback('INSTALL_ID', uuidv1).substr(0, 15) //TODO: Remove the substring once we update the db scheme
  }

  @computed
  get gpuNames(): string[] | undefined {
    if (this.machineInfo === undefined) return this.machineInfo

    return this.machineInfo.gpus.map(x => x.model)
  }

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {
    //Starts the timer to check for online/offline status
    setInterval(() => {
      this.checkOnlineStatus
    }, 5000)
    this.checkOnlineStatus()

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

      this.on(setMachineProcesses, (processes: Processes) => {
        this.setMachineProcesses(processes)
      })

      this.on(setMachineProcess, (process: Process) => {
        this.setMachineProcess(process)
      })

      this.on(setMachineProcessRunning, (service: Services[]) => {
        this.setMachineProcessRunning(service)
      })

      this.on(runError, (errorCode: number) => {
        console.log('Error code: ' + errorCode)

        store.analytics.captureException(new Error(`Received error code ${errorCode} from native`))

        if (errorCode === 8675309) {
          store.ui.showModal('errors/cuda')
        } else {
          store.ui.showModal('errors/unknown')
        }
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

  @action.bound
  private checkOnlineStatus = flow(function* (this: NativeStore) {
    console.log('Checking online status')
    try {
      yield this.axios.get('/')
      this.isOnline = true
    } catch (err) {
      console.error(err)
      this.isOnline = false
    }
  })

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

    this.store.analytics.trackRunStatus(true)
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
    this.store.analytics.trackRunStatus(false)
  }

  @action
  toggleRunning = () => {
    if (this.isRunning) {
      this.stop()
    } else {
      this.start()
    }
  }

  @action
  setProcessRunning = (status: boolean) => {
    this.isProcessRunning = status
  }

  @action
  getMachineProcesses = () => {
    this.send(getMachineProcesses)
  }

  @action
  getMachineProcess = (processName: string | undefined) => {
    this.send(getMachineProcess, processName)
  }

  @action
  getMachineProcessRunning = (services: string) => {
    this.send(getMachineProcessRunning, services)
  }

  @action
  setMachineProcesses = (processes: Processes) => {
    if (processes.all) {
      this.processes = processes
    }
  }

  @action
  setMachineProcess = (process: Process) => {
    this.process = undefined

    if (process) {
      this.process = process
      this.isProcessRunning = true
      return
    }

    this.isProcessRunning = false
  }

  @action
  setMachineProcessRunning = (services: Services[]) => {
    services.map(service => {
      if (service.running) {
        this.isProcessRunning = true
        return
      }
    })

    this.isProcessRunning = false
  }

  @action
  getBlacklist = () => {
    const blacklist = SmartStartStorage.getBlacklist(_BLACKLIST)

    if (blacklist) {
      this.blacklist = blacklist
      return this.blacklist
    }

    const list: Blacklist[] = [
      { name: 'Battle.net', process: 'Battle.net.exe', enabled: true },
      { name: 'Epic Games Launcher', process: 'EpicGamesLauncher.exe', enabled: true },
      { name: 'MS Word', process: 'WINWORD.exe', enabled: true },
      { name: 'MS Excel', process: 'EXCEL.exe', enabled: true },
      { name: 'Steam', process: 'Steam.exe', enabled: true },
      { name: 'Uplay', process: 'upc.exe', enabled: true },
      { name: 'Origin', process: 'Origin.exe', enabled: true },
    ]

    SmartStartStorage.setBlacklist(_BLACKLIST, list)

    this.blacklist = list

    return this.blacklist
  }

  @action
  setBlacklist = (blacklist: Blacklist[]) => {
    SmartStartStorage.setBlacklist(_BLACKLIST, blacklist)
  }

  @action.bound
  registerMachine = flow(function* (this: NativeStore) {
    if (!this.machineInfo) {
      console.warn('No valid machine info found. Unable to register.')
      return
    }

    let deviceInfo = {
      os: `${this.machineInfo.os.distro}-${this.machineInfo.os.release}`,
      gpus: this.gpuNames,
      gpuDriver: '0',
      macAddress: this.machineId,
      isAmdGpu: false,
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
  setMachineInfo = flow(function* (this: NativeStore, info: MachineInfo) {
    console.log('Received machine info')
    if (this.machineInfo) {
      console.log('Already receved machine info. Skipping...')
      return
    }

    this.machineInfo = info

    this.store.analytics.trackMachineInfo(info)

    let req = {
      gpuNames: this.gpuNames,
    }

    try {
      let res = yield this.axios.post('/check-gpu', req)

      console.log(res)

      let gpuList: GPUDetailsResource[] = res.data.gpuList

      //Ensure that at least 1 gpu is eligible
      this.validGPUs = gpuList.some(x => x.isEligible)
    } catch (err) {
      this.validGPUs = false
    }

    this.validOperatingSystem =
      info.os.platform === 'win32' && (info.os.release.startsWith('10.') || info.os.release.startsWith('6.1'))

    console.log(`Validing machine. OS:${this.validOperatingSystem}, GPUs ${this.validGPUs}`)

    this.skippedCompatCheck = this.validOperatingSystem && this.validGPUs

    this.loadingMachineInfo = false

    this.store.routing.replace('/')
  })

  @action.bound
  sendRunningStatus = flow(function* (this: NativeStore, status: boolean) {
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
