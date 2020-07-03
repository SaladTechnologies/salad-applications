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
import { getPluginDefinitions } from './PluginDefinitionFactory'
import { PluginDefinition, StartReason, StopReason } from './models'

export class SaladBowlStore {
  private currentPluginDefinition?: PluginDefinition
  private currentPluginDefinitionIndex: number = 0
  private currentPluginRetries: number = 0
  private heartbeatTimer?: NodeJS.Timeout
  private pluginDefinitions?: PluginDefinition[]
  private somethingWorks: boolean = false
  private timeoutTimer?: NodeJS.Timeout

  @observable
  public plugin: PluginInfo = new PluginInfo()

  @computed
  get canRun(): boolean {
    let cachedPluginDefinitions = getPluginDefinitions(this.store)
    return (
      this.store.machine &&
      this.store.machine.currentMachine !== undefined &&
      this.store.machine.currentMachine.qualifying &&
      this.store.native &&
      this.store.native.machineInfo !== undefined &&
      cachedPluginDefinitions.length > 0
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
    if (`${this.plugin.name}-${this.plugin.version}` !== message.name) {
      return
    }

    this.plugin.status = message.status
    if (this.timeoutTimer != null && this.currentPluginDefinition != null) {
      if (message.status === PluginStatus.Running) {
        // Hooray! The miner started. Let's stop the timeout watchdog.
        clearTimeout(this.timeoutTimer)
        this.currentPluginRetries = 0
        this.somethingWorks = true

        // But... it _could_ fail in the future... so let's keep watch!
        this.timeoutTimer = setTimeout(() => {
          this.timeoutTimer = undefined
          this.startNext()
        }, this.currentPluginDefinition.watchdogTimeout)
      } else if (message.status === PluginStatus.Stopped) {
        // This indicates the miner was automatically restarted.
        this.currentPluginRetries++
        if (this.currentPluginRetries > this.currentPluginDefinition.initialRetries) {
          clearTimeout(this.timeoutTimer)
          this.timeoutTimer = undefined
          this.startNext()
        }
      }
    }
  }

  @action
  onReceiveError = (message: ErrorMessage) => {
    this.store.analytics.trackMiningError(message.errorCategory, message.errorCode)
    // Show the error modal
    switch (message.errorCategory) {
      case ErrorCategory.AntiVirus:
        this.store.ui.showModal('/errors/anti-virus')
        break
      // case ErrorCategory.Driver:
      //   this.store.ui.showModal('/errors/cuda')
      //   break
      // case ErrorCategory.Network:
      //   this.store.ui.showModal('/errors/network')
      //   break
      // case ErrorCategory.Silent:
      //   console.log('Ignoring silent error')
      //   break
      // case ErrorCategory.Unknown:
      //   this.store.ui.showModal('/errors/unknown')
      //   break
    }
  }

  @action
  toggleRunning = () => {
    if (this.isRunning) {
      this.stop(StopReason.Manual)
    } else {
      this.start(StartReason.Manual)
    }
  }

  @action.bound
  start = flow(function*(this: SaladBowlStore, reason: StartReason) {
    if (this.isRunning) {
      return
    }
    if (!this.canRun) {
      console.log('This machine is not able to run.')
      return
    }

    if (this.timeoutTimer != null) {
      clearTimeout(this.timeoutTimer)
      this.timeoutTimer = undefined
    }

    if (this.heartbeatTimer != null) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = undefined
    }

    this.currentPluginDefinition = undefined
    this.currentPluginDefinitionIndex = 0
    this.currentPluginRetries = 0
    this.somethingWorks = false
    this.pluginDefinitions = getPluginDefinitions(this.store)
    if (this.pluginDefinitions.length === 0) {
      console.log('Unable to find a valid plugin definition for this machine. Unable to start.')
      return
    }

    this.currentPluginDefinition = this.pluginDefinitions[this.currentPluginDefinitionIndex]
    this.plugin.name = this.currentPluginDefinition.name
    this.plugin.version = this.currentPluginDefinition.version
    this.plugin.status = PluginStatus.Initializing
    yield this.store.native.send('start-salad', {
      name: `${this.currentPluginDefinition.name}-${this.currentPluginDefinition.version}`,
      downloadUrl: this.currentPluginDefinition.downloadUrl,
      exe: this.currentPluginDefinition.exe,
      args: this.currentPluginDefinition.args,
      runningCheck: this.currentPluginDefinition.runningCheck,
      errors: this.currentPluginDefinition.errors,
    })

    //Show a notification reminding users to use auto start
    if (reason === StartReason.Manual && this.store.autoStart.canAutoStart && !this.store.autoStart.autoStart) {
      this.store.notifications.sendNotification({
        title: 'Salad is best run AFK',
        message: `Don't forget to enable auto start in Settings`,
        id: 123456,
        onClick: () => this.store.routing.push('/settings/windows-settings'),
      })
    }

    this.timeoutTimer = setTimeout(() => {
      this.timeoutTimer = undefined
      this.startNext()
    }, this.currentPluginDefinition.initialTimeout)

    this.heartbeatTimer = setInterval(() => {
      this.sendRunningStatus()
    }, Config.statusHeartbeatRate)

    this.sendRunningStatus()
    this.store.analytics.trackStart(reason)
  })

  @action.bound
  startNext = flow(function*(this: SaladBowlStore) {
    if (this.pluginDefinitions == null) {
      return
    }

    this.currentPluginDefinitionIndex++
    if (this.currentPluginDefinitionIndex >= this.pluginDefinitions.length && this.somethingWorks) {
      // Don't stop... something works!
      this.currentPluginDefinitionIndex = 0
    }

    this.currentPluginRetries = 0
    if (this.currentPluginDefinitionIndex >= this.pluginDefinitions.length) {
      this.stop(StopReason.Fallthrough)
      this.store.ui.showModal('/errors/fallback')
    } else {
      this.currentPluginDefinition = this.pluginDefinitions[this.currentPluginDefinitionIndex]
      this.plugin.name = this.currentPluginDefinition.name
      this.plugin.version = this.currentPluginDefinition.version
      this.plugin.status = PluginStatus.Initializing
      yield this.store.native.send('start-salad', {
        name: `${this.currentPluginDefinition.name}-${this.currentPluginDefinition.version}`,
        downloadUrl: this.currentPluginDefinition.downloadUrl,
        exe: this.currentPluginDefinition.exe,
        args: this.currentPluginDefinition.args,
        runningCheck: this.currentPluginDefinition.runningCheck,
        errors: this.currentPluginDefinition.errors,
      })

      this.timeoutTimer = setTimeout(() => {
        this.timeoutTimer = undefined
        this.startNext()
      }, this.currentPluginDefinition.initialTimeout)

      this.sendRunningStatus()
    }
  })

  @action.bound
  stop = flow(function*(this: SaladBowlStore, reason: StopReason) {
    if (this.timeoutTimer != null) {
      clearTimeout(this.timeoutTimer)
      this.timeoutTimer = undefined
    }

    if (this.heartbeatTimer != null) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = undefined
    }

    this.plugin.status = PluginStatus.Stopped
    yield this.store.native.send('stop-salad')

    this.sendRunningStatus()
    this.store.analytics.trackStop(reason)
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
