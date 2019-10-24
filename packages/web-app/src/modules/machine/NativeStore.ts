import { action, observable, computed, runInAction, flow } from 'mobx'
import { RootStore } from '../../Store'
import * as Storage from '../../Storage'
import { MachineInfo } from './models'
import { AxiosInstance } from 'axios'

import { Machine } from './models/Machine'

const getMachineInfo = 'get-machine-info'
const setMachineInfo = 'set-machine-info'
const minimize = 'minimize-window'
const maximize = 'maximize-window'
const close = 'close-window'
const sendLog = 'send-log'
const getDesktopVersion = 'get-desktop-version'
const setDesktopVersion = 'set-desktop-version'
const enableAutoLaunch = 'enable-auto-launch'
const disableAutoLaunch = 'disable-auto-launch'

const compatibilityKey = 'SKIPPED_COMPAT_CHECK'
const AUTO_LAUNCH = 'AUTO_LAUNCH'

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

  // private failedCount: number = 0

  //#region Observables
  @observable
  public desktopVersion: string = ''

  @observable
  public isOnline: boolean = true

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
  public autoLaunch: boolean = true

  @observable
  public hashrate: number = 0

  //#endregion

  @computed
  get isNative(): boolean {
    return window.salad && window.salad.platform === 'electron'
  }

  @computed
  get apiVersion(): number {
    return window.salad && window.salad.apiVersion
  }

  @computed
  get canSendLogs(): boolean {
    return this.apiVersion >= 2
  }

  @computed
  get isCompatible(): boolean {
    return this.isNative && this.validOperatingSystem && this.validGPUs
  }

  @computed
  get machineId(): string {
    return this.store.token.getMachineId()
  }

  @computed
  get gpuNames(): string[] | undefined {
    if (this.machineInfo === undefined) return undefined
    return this.machineInfo.graphics.controllers.map(x => x.model)
  }

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {
    //Starts the timer to check for online/offline status
    // setInterval(this.checkOnlineStatus, 5000)
    // this.checkOnlineStatus()

    runInAction(() => {
      this.skippedCompatCheck = Storage.getOrSetDefault(compatibilityKey, 'false') === 'true'
    })

    console.log('Initial compat check: ' + this.skippedCompatCheck)

    if (this.isNative) {
      window.salad.onNative = this.onNative

      this.checkAutoLaunch()

      this.on(setDesktopVersion, (version: string) => {
        this.setDesktopVersion(version)
      })

      this.on(setMachineInfo, (info: MachineInfo) => {
        this.setMachineInfo(info)
      })

      this.send(getDesktopVersion)
    }
  }

  /** Callback function when the app receives a message from native code */
  private onNative = (args: { type: string; payload: any }) => {
    let func = this.callbacks.get(args.type)

    if (func) {
      console.log('Received message ' + args.type)
      func(args.payload)
    } else {
      console.log('Received unhandled message type ' + args.type)
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

  // @action.bound
  // private checkOnlineStatus = flow(function*(this: NativeStore) {
  //   var prevOnline = this.isOnline
  //   try {
  //     yield this.axios.get('online')
  //     this.failedCount = 0
  //     this.isOnline = true
  //   } catch (err) {
  //     //TODO: Remove these checks once we have an unauthenticated API to check
  //     if (err.response === undefined || err.response.status !== 401) {
  //       console.log(err)
  //       this.failedCount += 1

  //       if (this.failedCount >= 3) {
  //         this.isOnline = false
  //       }
  //     }
  //   }
  //   if (this.isOnline !== prevOnline) {
  //     console.log('>> [[NativeStore] checkOnlineStatus]')
  //     this.store.routing.replace('/')
  //   }
  // })

  @action
  setDesktopVersion = (version: string) => {
    console.log(`Setting desktop version: ${version}`)
    this.desktopVersion = version
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
  sendLog = () => {
    this.send(sendLog, this.machineId)
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

  @action.bound
  registerMachine = flow(function*(this: NativeStore) {
    if (!this.machineInfo) {
      console.warn('No valid machine info found. Unable to register.')
      return
    }

    try {
      console.log('Registering machine with salad')
      let res: any = yield this.axios.post(`machines/${this.machineId}/data`, this.machineInfo)
      let machine: Machine = res.data

      this.validGPUs = machine.validGpus
      this.validOperatingSystem = machine.validOs
      this.store.machine.setCurrentMachine(machine)
      this.store.analytics.trackMachine(machine)

      console.log('>> [[NativeStore] registerMachine]')

      if (!this.store.profile.isOnboarding) {
        this.store.routing.replace('/')
      }
    } catch (err) {
      this.store.analytics.captureException(new Error(`register-machine error: ${err}`))
      this.validGPUs = false
      throw err
    }
  })

  @action
  setMachineInfo = (info: MachineInfo) => {
    console.log('Received machine info')
    if (this.machineInfo) {
      console.log('Already received machine info. Skipping...')
      return
    }

    this.machineInfo = info

    this.skippedCompatCheck = this.validOperatingSystem && this.validGPUs
    this.loadingMachineInfo = false

    console.log('>> [[NativeStore] setMachineInfo]')

    if (!this.store.profile.isOnboarding) {
      this.store.routing.replace('/')
    }
  }

  @action
  skipCompatibility = () => {
    console.log('Updating compatibility check')

    this.skippedCompatCheck = true

    Storage.setItem(compatibilityKey, 'true')

    console.log('>> [[NativeStore] skipCompatibility]')
    this.store.routing.replace('/')
  }

  @action
  enableAutoLaunch = () => {
    this.autoLaunch = true
    Storage.setItem(AUTO_LAUNCH, 'true')

    this.send(enableAutoLaunch)
  }

  @action
  disableAutoLaunch = () => {
    this.autoLaunch = false
    Storage.setItem(AUTO_LAUNCH, 'false')

    this.send(disableAutoLaunch)
  }

  @action
  checkAutoLaunch = () => {
    if (window.salad.apiVersion <= 1) {
      this.autoLaunch = false
      return
    }

    this.autoLaunch = Storage.getOrSetDefault(AUTO_LAUNCH, this.autoLaunch.toString()) === 'true'
    this.autoLaunch && this.enableAutoLaunch()
  }
}
