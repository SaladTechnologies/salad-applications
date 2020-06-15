import { action, computed, flow, observable, runInAction } from 'mobx'
import { RootStore } from '../../Store'
import { MiningStatus } from '../machine/models'
import { PluginDefinition, StartReason, StopReason } from './models'
import { ErrorCategory } from './models/ErrorCategory'
import { ErrorMessage } from './models/ErrorMessage'
import { PluginInfo } from './models/PluginInfo'
import { PluginStatus } from './models/PluginStatus'
import { StatusMessage } from './models/StatusMessage'
import { getPluginDefinitions } from './PluginDefinitionFactory'

export class SaladBowlStore {
  private currentPluginDefinition?: PluginDefinition
  private currentPluginDefinitionIndex: number = 0
  private currentPluginRetries: number = 0
  private runningTimer?: NodeJS.Timeout
  private pluginDefinitions?: PluginDefinition[]
  private somethingWorks: boolean = false
  private timeoutTimer?: NodeJS.Timeout

  /** The timestamp last time that start was pressed */

  private startTimestamp?: Date

  /** The time since the start button was pressed (ms) */
  @observable
  public runningTime?: number = undefined

  @observable
  public plugin: PluginInfo = new PluginInfo('Unknown')

  @computed
  get canRun(): boolean {
    let cachedPluginDefinitions = getPluginDefinitions(this.store)
    return (
      this.store.machine &&
      this.store.machine.currentMachine !== undefined &&
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
        return MiningStatus.Running
      case PluginStatus.Unknown:
      default:
        return MiningStatus.Stopped
    }
  }

  constructor(private readonly store: RootStore) {
    this.store.native.on('mining-status', this.onReceiveStatus)
    this.store.native.on('mining-error', this.onReceiveError)
  }

  @action
  onReceiveStatus = (message: StatusMessage) => {
    if (this.plugin.name !== message.name) {
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
  start = flow(function* (this: SaladBowlStore, reason: StartReason) {
    if (this.isRunning) {
      return
    }

    if (!this.canRun) {
      console.log('This machine is not able to run.')
      return
    }

    //Ensures that the user is logged in
    yield this.store.auth.login()

    if (this.timeoutTimer != null) {
      clearTimeout(this.timeoutTimer)
      this.timeoutTimer = undefined
    }

    if (this.runningTimer) {
      clearInterval(this.runningTimer)
      this.runningTimer = undefined
      this.runningTime = undefined
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
    this.plugin.status = PluginStatus.Initializing
    yield this.store.native.send('start-salad', this.currentPluginDefinition)

    //Show a notification reminding users to use auto start
    if (reason === StartReason.Manual && this.store.autoStart.canAutoStart && !this.store.autoStart.autoStart) {
      this.store.notifications.sendNotification({
        title: 'Salad is best run AFK',
        message: `Don't forget to enable auto start in Settings`,
        id: 123456,
        onClick: () => this.store.routing.push('/settings/windows-settings'),
      })
    }

    this.startTimestamp = new Date(Date.now())
    this.runningTime = 0

    this.runningTimer = setInterval(() => {
      runInAction(() => {
        if (!this.startTimestamp) {
          this.runningTime = 0
        } else {
          this.runningTime = Date.now() - this.startTimestamp.getTime()
        }
      })
    }, 1000)

    this.timeoutTimer = setTimeout(() => {
      this.timeoutTimer = undefined
      this.startNext()
    }, this.currentPluginDefinition.initialTimeout)

    this.store.analytics.trackStart(reason)
  })

  @action.bound
  startNext = flow(function* (this: SaladBowlStore) {
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
      this.plugin.status = PluginStatus.Initializing
      yield this.store.native.send('start-salad', this.currentPluginDefinition)

      this.timeoutTimer = setTimeout(() => {
        this.timeoutTimer = undefined
        this.startNext()
      }, this.currentPluginDefinition.initialTimeout)
    }
  })

  @action.bound
  stop = flow(function* (this: SaladBowlStore, reason: StopReason) {
    if (this.timeoutTimer != null) {
      clearTimeout(this.timeoutTimer)
      this.timeoutTimer = undefined
    }

    if (this.runningTimer) {
      clearInterval(this.runningTimer)
      this.runningTimer = undefined
      this.startTimestamp = undefined
      console.log('Stopping after running for: ' + this.runningTime)
      this.runningTime = undefined
    }

    this.plugin.status = PluginStatus.Stopped
    yield this.store.native.send('stop-salad')

    this.store.analytics.trackStop(reason)
  })
}
