import { action, observable, computed, runInAction, flow } from 'mobx'
import { RootStore } from '../../Store'
import * as Storage from '../../Storage'
import { Config } from '../../config'
import { MachineInfo } from './models'
import { AxiosInstance } from 'axios'

const getMachineInfo = 'get-machine-info'
const setMachineInfo = 'set-machine-info'
const runStatus = 'run-status'
const runError = 'run-error'
const minimize = 'minimize-window'
const maximize = 'maximize-window'
const close = 'close-window'
const start = 'start-salad'
const stop = 'stop-salad'
const getDesktopVersion = 'get-desktop-version'
const setDesktopVersion = 'set-desktop-version'
const enableAutoLaunch = 'enable-auto-launch'
const disableAutoLaunch = 'disable-auto-launch'
const getHashrate = 'get-hashrate'
const setHashrate = 'set-hashrate'

const compatibilityKey = 'SKIPPED_COMPAT_CHECK'
const AUTO_LAUNCH = 'AUTO_LAUNCH'

const MINING_STATUS_STOPPED = 'Stopped'
const MINING_STATUS_STARTED = 'Initializing'
const MINING_STATUS_RUNNING = 'Chopping'

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
  private zeroHashTimespan: number = 0

  @observable
  public desktopVersion: string = ''

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
  public autoLaunch: boolean = true

  @observable
  public miningStatus: string = 'Stopped'

  @observable
  public hashrate: number = 0

  @computed
  get isNative(): boolean {
    return window.salad && window.salad.platform === 'electron'
  }

  @computed
  get isCompatible(): boolean {
    // TODO: return this.isNative && this.validOperatingSystem && this.validGPUs
    return true
  }

  @computed
  get machineId(): string {
    return this.store.token.getMachineId()
  }

  @computed
  get gpuNames(): string[] | undefined {
    if (this.machineInfo === undefined) return undefined
    return this.machineInfo.graphics.graphicsControllerData.map(x => x.model)
  }

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {
    //Starts the timer to check for online/offline status
    setInterval(this.checkOnlineStatus, 5000)
    this.checkOnlineStatus()

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

      this.on(runStatus, (status: boolean) => {
        console.log('Received run status: ' + status)
        this.setRunStatus(status)
      })

      this.on(setMachineInfo, (info: MachineInfo) => {
        this.setMachineInfo(info)
      })

      this.on(runError, (errorCode: number) => {
        console.log('Error code: ' + errorCode)

        store.analytics.captureException(new Error(`Received error code ${errorCode} from native`))

        switch (errorCode) {
          case 8675309:
          case 3221225595:
            store.ui.showModal('/errors/cuda')
            break
          default:
            store.ui.showModal('/errors/unknown')
            break
        }
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

  @action.bound
  private checkOnlineStatus = flow(function*(this: NativeStore) {
    console.log('Checking online status')

    try {
      yield this.axios.get('/', {
        baseURL: 'https://api.salad.io/core/master/',
      })
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
      }, Config.statusHeartbeatRate)
    } else {
      this.sendRunningStatus(false)
    }
  }

  @action
  setDesktopVersion = (version: string) => {
    console.log(`Setting desktop version: ${version}`)
    this.desktopVersion = version
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

  @action.bound
  registerMachine = flow(function*(this: NativeStore) {
    if (!this.machineInfo) {
      console.warn('No valid machine info found. Unable to register.')
      return
    }

    try {
      console.log('Registering machine with salad')
      let res: any = yield this.axios.post(`machines/${this.machineId}/data`, this.machineInfo)
      console.log(res)

      this.validGPUs = res.data.validGpus
      this.validOperatingSystem = res.data.validOs
    } catch (err) {
      this.validGPUs = false
      throw err
    }
  })

  @action.bound
  setMachineInfo = (info: MachineInfo) => {
    console.log('Received machine info')
    if (this.machineInfo) {
      console.log('Already received machine info. Skipping...')
      return
    }

    this.machineInfo = info

    this.store.analytics.trackMachineInfo(info)
    this.skippedCompatCheck = this.validOperatingSystem && this.validGPUs
    this.loadingMachineInfo = false
    this.store.routing.replace('/')
  }

  @action
  skipCompatibility = () => {
    console.log('Updating compatibility check')

    this.skippedCompatCheck = true

    Storage.setItem(compatibilityKey, 'true')

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

  //#region Hashrate monitoring
  setHashrateFromLog = () => {
    this.on(setHashrate, (hash: number) => this.setHashrate(hash))
  }

  @action
  private setHashrate = (hash: number) => {
    this.hashrate = hash
    console.log('Hashrate: ', this.hashrate)
  }

  @action
  hashrateHeartbeat = (runStatus: boolean) => {
    if (runStatus && this.isNative) {
      this.send(getHashrate)
      this.setHashrateFromLog()

      if (this.hashrate > 0) {
        this.miningStatus = MINING_STATUS_RUNNING
        this.zeroHashTimespan = 0
        return
      }

      if (this.zeroHashTimespan >= Config.zeroHashrateNotification) {
        this.zeroHashTimespan = 0
        this.store.ui.showModal('/errors/unknown')
      }

      this.miningStatus = MINING_STATUS_STARTED
      this.zeroHashTimespan++

      return
    }

    this.hashrate = 0
    this.miningStatus = MINING_STATUS_STOPPED
    this.zeroHashTimespan = 0
  }
  //#endregion

  @action.bound
  sendRunningStatus = flow(function*(this: NativeStore, runStatus: boolean) {
    console.log('Status MachineId: ' + this.machineId)

    this.hashrateHeartbeat(runStatus)

    const machineId = this.store.token.getMachineId()
    let miningStatus =
      this.zeroHashTimespan > 1
        ? 'Running'
        : this.miningStatus === MINING_STATUS_RUNNING
        ? 'Running'
        : this.miningStatus

    const data = {
      status: miningStatus,
    }

    yield this.axios.post(`machines/${machineId}/status`, data)
  })

  sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
