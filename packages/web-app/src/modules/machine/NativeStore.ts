import { action, observable, computed, runInAction, flow } from 'mobx'
import { RootStore } from '../../Store'
import * as Storage from '../../Storage'
import { Config } from '../../config'
import { MachineInfo, MiningStatus } from './models'
import { AxiosInstance } from 'axios'

import { Machine } from './models/Machine'
import { featureFlags } from '../../FeatureFlags'

const getMachineInfo = 'get-machine-info'
const setMachineInfo = 'set-machine-info'
const runStatus = 'run-status'
const runError = 'run-error'
const minimize = 'minimize-window'
const maximize = 'maximize-window'
const close = 'close-window'
const start = 'start-salad'
const stop = 'stop-salad'
const sendLog = 'send-log'
const getDesktopVersion = 'get-desktop-version'
const setDesktopVersion = 'set-desktop-version'
const enableAutoLaunch = 'enable-auto-launch'
const disableAutoLaunch = 'disable-auto-launch'
const getHashrate = 'get-hashrate'
const setHashrate = 'set-hashrate'

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
  private runningHeartbeat?: NodeJS.Timeout
  private zeroHashTimespan: number = 0
  private restartingMiner?: NodeJS.Timeout

  //#region Observables
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
  public machineStatus: string = 'stopped'

  @observable
  public hashrate: number = 0

  @observable
  public runningStatus: boolean = false
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
  get minerId(): string | undefined {
    if (this.store.machine.currentMachine !== undefined) {
      return this.store.machine.currentMachine.minerId
    } else {
      return undefined
    }
  }

  @computed
  get gpuNames(): string[] | undefined {
    if (this.machineInfo === undefined) return undefined
    return this.machineInfo.graphics.controllers.map(x => x.model)
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
        console.log('Error code: ', errorCode)

        switch (errorCode) {
          case 8675309: // CUDA - Tommy Tutone - 867-5309/Jenny: https://youtu.be/6WTdTwcmxyo
            store.ui.showModal('/errors/cuda')
            store.analytics.captureException(new Error(`Received CUDA error code ${errorCode} from native`))
            store.analytics.track('CUDA Error', { ErrorCode: errorCode })
            break
          case 314159265: // Anti-virus - Pie!
            store.ui.showModal('/errors/anti-virus')
            store.analytics.captureException(new Error(`Received Anti-Virus error code ${errorCode} from native`))
            store.analytics.track('Anti-Virus Error', { ErrorCode: errorCode })
            this.stop()
            break
          case 4000: // Network errors
          case 4001:
          case 4002:
          case 4003:
          case 4004:
            store.ui.showModal('/errors/network')
            this.restartMiner()
            store.analytics.track('Network Error', { ErrorCode: errorCode })
            break
          case 8888: // Generic, ethminer.exe terminated, no modal error message
            store.analytics.track('Ethminer.exe Stopped', { ErrorCode: errorCode })
            this.stop()
            break
          case 9998: // Nonce
            this.restartMiner()
            store.analytics.captureException(new Error(`Received Nonce error code ${errorCode} from native`))
            store.analytics.track('Nonce Unknown Error', { ErrorCode: errorCode })
            break
          case 9999: // Generic, "WTH happened"
          default:
            store.ui.showModal('/errors/unknown')
            store.analytics.captureException(new Error(`Received Unknown error code ${errorCode} from native`))
            store.analytics.track('Generic Unknown Error', { ErrorCode: errorCode })
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
    var prevOnline = this.isOnline
    try {
      yield this.axios.get('online')
      this.isOnline = true
    } catch (err) {
      //TODO: Remove these checks once we have an unauthenticated API to check
      if (err.response === undefined || err.response.status !== 401) {
        console.log(err)
        this.isOnline = false
      }
    }
    if (this.isOnline !== prevOnline) {
      this.store.routing.replace('/')
    }
  })

  @action
  setRunStatus = (status: boolean) => {
    this.isRunning = status

    if (this.runningHeartbeat) {
      clearInterval(this.runningHeartbeat)
    }

    if (status) {
      this.runningStatus = true
      //Send the initial heartbeat
      this.sendRunningStatus(this.runningStatus)

      //Schedule future heartbeats
      this.runningHeartbeat = setInterval(() => {
        this.sendRunningStatus(this.runningStatus)
      }, Config.statusHeartbeatRate)
    } else {
      this.runningStatus = false
      this.sendRunningStatus(this.runningStatus)
    }
  }

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

  @action
  start = () => {
    if (!this.isCompatible) {
      throw new Error('Incompatible machine. Cannot start.')
    }

    if (this.isRunning) {
      console.warn('Already running. Skipping...')
      return
    }

    if (window.salad.apiVersion <= 2) {
      this.send(start, this.machineId)
    } else {
      let address = ''
      if (window.salad.apiVersion >= 4 && featureFlags.getBool('nice-hash-pool')) {
        if (!this.minerId) {
          throw new Error('MinerId not found. Check that the machine is valid first. Cannot start.')
        }
        address = `stratum2+tcp://368dnSPEiXj1Ssy35BBWMwKcmFnGLuqa1J.${this.minerId}@daggerhashimoto.usa.nicehash.com:3353`
      } else {
        address = `stratum1+tcp://0x6fF85749ffac2d3A36efA2BC916305433fA93731@eth-us-west1.nanopool.org:9999/${this.machineId}/notinuse%40salad.io`
      }

      this.send(start, {
        machineId: this.machineId,
        address: address,
      })
    }

    if (this.restartingMiner) clearTimeout(this.restartingMiner)
    this.miningStatus = MiningStatus.Started
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

    if (this.restartingMiner) clearTimeout(this.restartingMiner)
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
      let machine: Machine = res.data

      this.validGPUs = machine.validGpus
      this.validOperatingSystem = machine.validOs
      this.store.machine.setCurrentMachine(machine)
      this.store.analytics.trackCompatibleGpu(this.validGPUs)
      this.store.routing.replace('/')
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
  hashrateHeartbeat = (runStatus: boolean, machineStatus: string) => {
    if (runStatus && this.isNative) {
      this.send(getHashrate)
      this.setHashrateFromLog()

      if (machineStatus === MiningStatus.Running && this.hashrate > 0) {
        this.zeroHashTimespan = 0
        this.store.analytics.track('Mining Status', { MiningStatus: MiningStatus.Earning })
        this.store.analytics.trackEarning(true)
        return
      }

      if ((machineStatus === MiningStatus.Stopped && this.hashrate > 0) || this.hashrate > 0) {
        this.miningStatus = MiningStatus.Running
        this.zeroHashTimespan = 0
        this.store.analytics.track('Mining Status', { MiningStatus: MiningStatus.Running })
        return
      }

      if (this.zeroHashTimespan >= Config.zeroHashrateNotification) {
        this.miningStatus = MiningStatus.Error
        this.zeroHashTimespan = 0
        this.store.ui.showModal('/errors/unknown')
        this.store.analytics.track('Mining Status', {
          MiningStatus: MiningStatus.Error,
          Message: `${this.hashrate} hashrate for longer than ${Config.zeroHashrateNotification} minutes`,
        })
        this.store.analytics.trackEarning(false)
      }

      this.miningStatus = MiningStatus.Started
      this.zeroHashTimespan++
      this.store.analytics.track('Mining Status', { MiningStatus: MiningStatus.Started })

      return
    }

    this.hashrate = 0
    this.miningStatus = this.miningStatus === MiningStatus.Restarting ? MiningStatus.Restarting : MiningStatus.Stopped
    this.zeroHashTimespan = 0
    this.store.balance.currentBalance = this.store.balance.actualBalance
    this.store.analytics.track('Mining Status', { MiningStatus: MiningStatus.Stopped })
  }
  //#endregion

  @action
  restartMiner = () => {
    this.stop()
    this.miningStatus = MiningStatus.Restarting
    this.restartingMiner = setTimeout(() => {
      this.start()
    }, 5000)
  }

  @action.bound
  sendRunningStatus = flow(function*(this: NativeStore, runStatus: boolean) {
    console.log('Status MachineId: ' + this.machineId)

    const machineId = this.store.token.getMachineId()
    const response = yield this.axios.get(`machines/${machineId}/status`)
    this.machineStatus = response.data.status.toString()

    this.hashrateHeartbeat(runStatus, this.machineStatus)

    let miningStatus =
      this.zeroHashTimespan > 1
        ? MiningStatus.Running
        : this.miningStatus === MiningStatus.Running || this.miningStatus === MiningStatus.Earning
        ? MiningStatus.Running
        : this.miningStatus

    this.store.analytics.track('Machine Status', { MachineStatus: this.machineStatus })

    const data = {
      status: miningStatus,
    }
    try {
      yield this.axios.post(`machines/${machineId}/status`, data)
    } catch {}
  })
}
