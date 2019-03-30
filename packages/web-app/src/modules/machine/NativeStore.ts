import { action, observable, computed, runInAction, flow } from 'mobx'
import { RootStore } from '../../Store'
import * as Storage from '../../Storage'
import { MachineInfo } from './models'

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
    return this.validOperatingSystem && this.validGPUs
  }

  @computed
  get gpuNames(): string[] | undefined {
    if (this.machineInfo === undefined) return this.machineInfo

    return this.machineInfo.gpus.map(x => x.model)
  }

  constructor(private readonly store: RootStore) {
    window.addEventListener('online', () => this.setOnlineStatus(true))
    window.addEventListener('offline', () => this.setOnlineStatus(false))
    this.setOnlineStatus(navigator.onLine)
    console.log('Added online listeners')

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

  private onNative = (args: { type: string; payload: any }) => {
    let func = this.callbacks.get(args.type)

    if (func) {
      console.log('Received message ' + args.type)
      func(args.payload)
    } else {
      console.log('Recevied unhandled message type ' + args.type)
    }
  }

  public on = (type: string, listener: Function) => {
    this.callbacks.set(type, listener)
  }

  public send = (type: string, payload?: any) => {
    if (!this.isNative) {
      console.warn('Unable to send. Not running in electron env.')
      return
    }
    window.salad.dispatch(type, payload)
  }

  @action
  setOnlineStatus = (status: boolean) => {
    console.log('Online status updated: ' + status)
    this.isOnline = status
  }

  @action
  setRunStatus = (status: boolean) => {
    this.isRunning = status
  }

  @action
  loadMachineInfo = () => {
    if (this.machineInfo) {
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
    this.send(start)
  }

  @action
  stop = () => {
    this.send(stop)
  }

  @action
  toggleRunning = () => {
    if (this.isRunning) {
      this.send(stop)
    } else {
      this.send(start)
    }
  }

  @action.bound
  setMachineInfo = flow(function*(this: NativeStore, info: MachineInfo) {
    console.log('Received machine info')
    if (this.machineInfo) {
      console.log('Already receved machine info. Skipping...')
      return
    }

    this.machineInfo = info

    //TODO: Fire off the API call to get the earning rate/GPU and determine if this machine is valid
    yield this.sleep(5000)

    this.validGPUs = true

    this.validOperatingSystem =
      info.os.platform === 'win32' && (info.os.release.startsWith('10.') || info.os.release.startsWith('6.1'))

    this.skippedCompatCheck = this.validOperatingSystem && this.validGPUs

    this.loadingMachineInfo = false
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
