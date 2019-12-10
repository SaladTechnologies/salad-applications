import { observable, action, flow, computed } from 'mobx'
import { PluginInfo } from './models/PluginInfo'
import { StatusMessage } from './models/StatusMessage'
import { PluginStatus } from './models/PluginStatus'
import { AxiosInstance, AxiosError } from 'axios'
import { Config } from '../../config'
import { RootStore } from '../../Store'
import { MiningStatus } from '../machine/models'
import { ErrorMessage } from './models/ErrorMessage'
import { ErrorCategory } from './models/ErrorCategory'
import { MachineStatus } from './models/MachineStatus'
import { getPluginDefinition } from './PluginDefinitionFactory'

export class SaladBowlStore {
  private runningHeartbeat?: NodeJS.Timeout

  @observable
  public plugin: PluginInfo = new PluginInfo('Unknown')

  @observable
  public errorCategory?: string

  @observable
  public errorMessage?: string

  @observable
  public initializingStatus: boolean = false

  @observable
  public runningStatus: boolean = false

  @observable
  public earningStatus: boolean = false

  // @observable
  // public errorMessage?: string

  @computed
  get canRun(): boolean {
    return (
      this.store.machine &&
      this.store.machine.currentMachine !== undefined &&
      this.store.machine.currentMachine.qualifying &&
      this.store.native &&
      this.store.native.machineInfo !== undefined
    )
  }

  @computed
  get isRunning(): boolean {
    return this.plugin.status !== PluginStatus.Stopped && this.plugin.status !== PluginStatus.Unknown
  }

  @computed
  get status(): MiningStatus {
    switch (this.plugin.status) {
      case PluginStatus.Installing:
        return MiningStatus.Installing
      case PluginStatus.Initializing:
        return MiningStatus.Initializing
      case PluginStatus.Running:
        if (this.store.balance.lastDeltaBalance > 0) return MiningStatus.Earning
        else return MiningStatus.Running
      case PluginStatus.Unknown:
      default:
        return MiningStatus.Stopped
    }
  }

  /** Returns the summary status for the machine */
  @computed
  get machineStatus(): MachineStatus {
    switch (this.plugin.status) {
      case PluginStatus.Installing:
      case PluginStatus.Initializing:
        return MachineStatus.Initializing
      case PluginStatus.Running:
        return MachineStatus.Running
      case PluginStatus.Unknown:
      default:
        return MachineStatus.Stopped
    }
  }

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {
    this.store.native.on('mining-status', this.onReceiveStatus)
    this.store.native.on('mining-error', this.onReceiveError)
  }

  @action
  onReceiveStatus = (message: StatusMessage) => {
    this.plugin.name = message.name
    this.plugin.status = message.status

    switch (this.plugin.status) {
      case PluginStatus.Initializing:
        this.initializingStatus = true
        break
      case PluginStatus.Running:
        if (this.store.balance.lastDeltaBalance > 0) {
          this.earningStatus = true
        } else {
          this.runningStatus = true
        }
        break
    }
  }

  @action
  onReceiveError = (message: ErrorMessage) => {
    this.store.analytics.trackMiningError(message.errorCategory, message.errorCode)

    if (this.store.profile.onboarding) {
      this.store.analytics.trackError(`Onbarding: ${message.errorCategory}`)
    }

    // Show the error modal
    switch (message.errorCategory) {
      case ErrorCategory.AntiVirus:
        this.errorCategory = ErrorCategory.AntiVirus
        this.errorMessage = 'Anti-Virus removed the miner'

        // This is starting to feel dirty
        if (!this.store.profile.onboarding) {
          this.store.ui.showModal('/errors/anti-virus')
        }
        break
      case ErrorCategory.Driver:
        this.errorCategory = ErrorCategory.Driver
        this.errorMessage = 'Incompatible CUDA driver'
        break
      case ErrorCategory.Network:
        this.errorCategory = ErrorCategory.Network
        this.errorMessage = 'Network error'
        break
      case ErrorCategory.Silent:
        console.log('Ignoring silent error')
        break
      case ErrorCategory.Unknown:
      default:
        this.errorCategory = ErrorCategory.Unknown
        this.errorMessage = 'Unknown error'
        break
    }
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
  start = flow(function*(this: SaladBowlStore) {
    if (!this.canRun) {
      console.log('This machine is not able to run.')
      return
    }

    let pluginDefinition = getPluginDefinition(this.store)

    if (!pluginDefinition) {
      console.log('Unable to find a valid plugin definition for this machine. Unable to start.')
      return
    }

    this.plugin.name = pluginDefinition.name
    this.plugin.status = PluginStatus.Initializing

    yield this.store.native.send('start-salad', pluginDefinition)

    if (!this.runningHeartbeat) {
      this.runningHeartbeat = setInterval(() => {
        this.sendRunningStatus()
      }, Config.statusHeartbeatRate)
    }

    this.sendRunningStatus()

    this.store.analytics.trackStart()
  })

  @action.bound
  stop = flow(function*(this: SaladBowlStore) {
    yield this.store.native.send('stop-salad')
    this.plugin.status = PluginStatus.Stopped

    this.initializingStatus = this.runningStatus = this.earningStatus = false

    this.sendRunningStatus()

    if (this.runningHeartbeat) {
      clearInterval(this.runningHeartbeat)
      this.runningHeartbeat = undefined
    }

    this.store.analytics.trackStop()
  })

  @action.bound
  sendRunningStatus = flow(function*(this: SaladBowlStore, retry?: boolean) {
    const machineId = this.store.token.machineId

    if (!machineId) {
      console.warn('No machineId found. Unable to send running status')
      return
    }

    const data = {
      status: this.machineStatus,
    }

    try {
      yield this.axios.post(`machines/${machineId}/status`, data)
    } catch (e) {
      let err: AxiosError = e
      if (err.response && err.response.status === 409) {
        console.log('Machine status conflict. Restarting')
        if (!retry) {
          this.plugin.status = PluginStatus.Initializing
          this.sendRunningStatus(true)
        }
      } else {
        throw e
      }
    }
  })
}
