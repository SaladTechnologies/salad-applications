import { Duration } from 'luxon'
import { action, autorun, computed, flow, observable, runInAction } from 'mobx'
import { EOL } from 'os'
import * as Storage from '../../Storage'
import { RootStore } from '../../Store'
import { ErrorPageType } from '../../UIStore'
import { MiningStatus } from '../machine/models'
import { NotificationMessageCategory } from '../notifications/models'
import { IPersistentStore } from '../versions/IPersistentStore'
import { getPluginDefinitions } from './definitions'
import { Accounts, BEAM_WALLET_ADDRESS, ETH_WALLET_ADDRESS, getNiceHashMiningAddress } from './definitions/accounts'
import { PluginDefinition, StartActionType, StartReason, StopReason } from './models'
import { ErrorCategory } from './models/ErrorCategory'
import { ErrorMessage } from './models/ErrorMessage'
import { PluginInfo } from './models/PluginInfo'
import { PluginStatus } from './models/PluginStatus'
import { StatusMessage } from './models/StatusMessage'
import { SaladBowlStoreInterface } from './SaladBowlStoreInterface'
import { getPreppingPercentage } from './utils'

const CPU_MINING_ENABLED = 'CPU_MINING_ENABLED'
const GPU_MINING_OVERRIDDEN = 'GPU_MINING_OVERRIDDEN'
const CPU_MINING_OVERRIDDEN = 'CPU_MINING_OVERRIDDEN'

export class SaladBowlStore implements SaladBowlStoreInterface, IPersistentStore {
  private currentPluginDefinition?: PluginDefinition
  private currentPluginDefinitionIndex: number = 0
  private currentPluginRetries: number = 0
  private runningTimer?: NodeJS.Timeout
  private somethingWorks: boolean = false
  private timeoutTimer?: NodeJS.Timeout

  /** The timestamp last time that start was pressed */

  private startTimestamp?: Date

  /** The time since the start button was pressed (ms) */
  @observable
  public runningTime?: number = undefined

  /** The total time we have been in the chopping state since the start button was pressed (ms) */
  private choppingTime?: number = undefined

  @observable
  public plugin: PluginInfo = new PluginInfo()

  @observable
  public cpuMiningEnabled: boolean = false

  @observable
  public gpuMiningEnabled: boolean = true

  @observable
  public cpuMiningOverridden: boolean = false

  @observable
  public gpuMiningOverridden: boolean = false

  @computed
  private get pluginDefinitions(): PluginDefinition[] {
    const machine = this.store.machine.currentMachine
    const machineInfo = this.store.native.machineInfo
    if (machine === undefined || machineInfo === undefined) {
      return []
    }

    const accounts: Accounts = {
      ethermine: {
        address: ETH_WALLET_ADDRESS,
        workerId: machine.minerId,
      },
      flypoolBeam: {
        address: BEAM_WALLET_ADDRESS,
        workerId: machine.minerId,
      },
      nicehash: {
        address: getNiceHashMiningAddress(machine.id),
        rigId: machine.minerId,
      },
    }
    const pluginDefinitions = getPluginDefinitions(accounts, machineInfo.platform ?? window.salad.platform).filter(
      (pluginDefinition) =>
        pluginDefinition.requirements.every((requirement) =>
          requirement(machineInfo, {
            cpu: this.cpuMiningEnabled,
            gpu: this.gpuMiningEnabled,
            cpuOverridden: this.cpuMiningOverridden,
            gpuOverridden: this.gpuMiningOverridden,
          }),
        ),
    )
    console.log(
      `${EOL}========== Supported Plugins ==========${EOL}CPU Enabled:${this.cpuMiningEnabled}${EOL}GPU Enabled:${
        this.gpuMiningEnabled
      }${EOL}---------------------------------------${EOL}NiceHash wallet address: ${
        accounts.nicehash.address
      }${EOL}NiceHash rig ID: ${
        accounts.nicehash.rigId
      }${EOL}---------------------------------------${EOL}Ethermine wallet address: ${
        accounts.ethermine.address
      }${EOL}Ethermine worker ID: ${accounts.ethermine.workerId}${EOL}---------------------------------------${EOL}${
        pluginDefinitions.length === 0
          ? 'No plugins are available to support the hardware in this machine. :-('
          : pluginDefinitions.reduce((output, pluginDefinition) => {
              return output + `${pluginDefinition.name} ${pluginDefinition.version} ${pluginDefinition.algorithm}${EOL}`
            }, '')
      }=======================================`,
    )

    return pluginDefinitions
  }

  @computed
  get canRun(): boolean {
    return (
      this.store.auth.isAuthenticated !== undefined &&
      this.store.auth.isAuthenticated &&
      this.store.machine &&
      this.store.machine.currentMachine !== undefined &&
      this.store.native &&
      this.store.native.machineInfo !== undefined &&
      this.pluginDefinitions.length > 0
    )
  }

  @computed
  get isRunning(): boolean {
    return this.plugin.status !== PluginStatus.Stopped && this.plugin.status !== PluginStatus.Unknown
  }

  @computed
  get isNotCompatible(): boolean {
    return !this.canRun
  }

  @computed
  get isOverriding(): boolean {
    return this.gpuMiningOverridden || this.cpuMiningOverridden
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

  @computed
  get preppingProgress(): number {
    return getPreppingPercentage(this.runningTime)
  }

  @computed
  get runningTimeDisplay():
    | {
        value: number
        unit: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second'
      }
    | undefined {
    if (this.runningTime === undefined) {
      return undefined
    }

    const duration: Duration = Duration.fromMillis(this.runningTime)
    const interval = duration.shiftTo('years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds').toObject()
    if (interval.years !== undefined && interval.years >= 1) {
      return { value: interval.years, unit: 'year' }
    } else if (interval.months !== undefined && interval.months >= 1) {
      return { value: interval.months, unit: 'month' }
    } else if (interval.weeks !== undefined && interval.weeks >= 1) {
      return { value: interval.weeks, unit: 'week' }
    } else if (interval.days !== undefined && interval.days >= 1) {
      return { value: interval.days, unit: 'day' }
    } else if (interval.hours !== undefined && interval.hours >= 1) {
      return { value: interval.hours, unit: 'hour' }
    } else if (interval.minutes !== undefined && interval.minutes >= 1) {
      return { value: Math.ceil(interval.minutes), unit: 'minute' }
    } else {
      return { value: interval.seconds ? Math.ceil(interval.seconds) : 0, unit: 'second' }
    }
  }

  constructor(private readonly store: RootStore) {
    this.store.native.on('mining-status', this.onReceiveStatus)
    this.store.native.on('mining-error', this.onReceiveError)

    //Loads the initial CPU mining flag
    this.setGpuOnly(!(Storage.getItem(CPU_MINING_ENABLED) === 'true'))

    //Loads initial CPU mining overridden flag
    this.setCpuOverride(Storage.getItem(CPU_MINING_OVERRIDDEN) === 'true')

    //Loads initial GPU mining overridden flag
    this.setGpuOverride(Storage.getItem(GPU_MINING_OVERRIDDEN) === 'true')
  }

  getSavedData(): object {
    if (!this.isRunning) {
      return {}
    }

    return {
      isRunning: this.isRunning,
      startTimestamp: this.startTimestamp,
      choppingTime: this.choppingTime,
    }
  }

  onDataLoaded(data: unknown): void {
    if (typeof data !== 'object' || data == null) {
      return
    }

    autorun(() => {
      if (!this.store.auth.isAuthenticated || !this.canRun) {
        return
      }

      const isRunning = (data as { isRunning?: unknown }).isRunning
      if (isRunning !== true && isRunning !== 'true') {
        return
      }

      const startTimestamp = (data as { startTimestamp?: unknown }).startTimestamp
      let start: Date
      if (typeof startTimestamp === 'number' || typeof startTimestamp === 'string') {
        start = new Date(startTimestamp)
        if (isNaN(start.valueOf())) {
          start = new Date()
        }
      } else {
        start = new Date()
      }

      const choppingTime = (data as { choppingTime?: unknown }).choppingTime
      let time: number
      if (typeof choppingTime === 'number') {
        time = Math.floor(choppingTime)
      } else if (typeof choppingTime === 'string') {
        time = parseInt(choppingTime)
        if (isNaN(time)) {
          time = 0
        }
      } else {
        time = 0
      }

      if (time < 0) {
        time = 0
      } else if (time > Number.MAX_SAFE_INTEGER) {
        time = Number.MAX_SAFE_INTEGER
      }

      // Resume mining.
      this.start(StartReason.Refresh, start, time)
    })
  }

  @action
  private onReceiveStatus = (message: StatusMessage) => {
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
  private onReceiveError = (message: ErrorMessage) => {
    // Show the error modal
    switch (message.errorCategory) {
      case ErrorCategory.AntiVirus:
        this.store.ui.showErrorPage(ErrorPageType.AntiVirus, message)
        break
      case ErrorCategory.Firewall:
        this.store.ui.showErrorPage(ErrorPageType.Firewall, message)
        break
      // case ErrorCategory.Driver:
      // this.store.ui.showErrorPage(ErrorPageType.Cuda)
      //   break
      // case ErrorCategory.Network:
      // this.store.ui.showErrorPage(ErrorPageType.Network)
      //   break
      // case ErrorCategory.Silent:
      //   console.log('Ignoring silent error')
      //   break
      // case ErrorCategory.Unknown:
      // this.store.ui.showErrorPage(ErrorPageType.Unknown)
      //   break
    }
  }

  public toggleRunning = flow(
    function* (this: SaladBowlStore, startAction: StartActionType) {
      if (startAction !== StartActionType.Automatic) {
        try {
          yield this.store.auth.login()
        } catch {
          return
        }
      }

      if (
        startAction !== StartActionType.StartButton &&
        startAction !== StartActionType.StopPrepping &&
        this.isRunning
      ) {
        return
      }

      switch (startAction) {
        case StartActionType.StartButton:
          if (this.isRunning) {
            if (this.status === MiningStatus.Initializing || this.status === MiningStatus.Installing) {
              this.store.ui.showModal('/warnings/dont-lose-progress')
              return
            }
            this.stop(StopReason.Manual)
          } else {
            this.store.analytics.trackButtonClicked('start_button', 'Start Button', 'enabled')

            this.start(StartReason.Manual)
          }
          break
        case StartActionType.Override:
          this.store.analytics.trackButtonClicked('override_button', 'Override Button', 'enabled')
          this.gpuMiningEnabled ? this.setGpuOverride(true) : this.setCpuOverride(true)
          this.start(StartReason.Manual)
          break
        case StartActionType.SwitchMiner:
          this.store.analytics.trackButtonClicked('switch_mining_type_button', 'Switch Mining Type Button', 'enabled')
          this.setGpuOnly(!this.gpuMiningEnabled)
          this.start(StartReason.Manual)
          break
        case StartActionType.StopPrepping:
          this.store.analytics.trackButtonClicked('stop_prepping_button', 'Stop Prepping Button', 'enabled')
          this.store.ui.hideModal()
          this.stop(StopReason.Manual)
          break
        case StartActionType.Automatic:
          this.start(StartReason.Automatic)
          break
      }
    }.bind(this),
  )

  @action.bound
  private start = flow(function* (
    this: SaladBowlStore,
    reason: StartReason,
    startTimestamp?: Date,
    choppingTime?: number,
  ) {
    if (this.isRunning) {
      return
    }

    if (!this.canRun) {
      if (this.store.auth.isAuthenticated && !this.isOverriding) {
        this.store.ui.showErrorPage(ErrorPageType.NotCompatible)
      }
      console.log('This machine is not able to run.')
      return
    }

    this.store.ui.updateViewedAVErrorPage(false)
    if (this.timeoutTimer != null) {
      clearTimeout(this.timeoutTimer)
      this.timeoutTimer = undefined
    }

    if (this.runningTimer) {
      clearInterval(this.runningTimer)
      this.runningTimer = undefined
      this.runningTime = undefined
      this.choppingTime = undefined
    }

    this.currentPluginDefinition = undefined
    this.currentPluginDefinitionIndex = 0
    this.currentPluginRetries = 0
    this.somethingWorks = false

    this.currentPluginDefinition = this.pluginDefinitions[this.currentPluginDefinitionIndex]
    this.plugin.name = this.currentPluginDefinition.name
    this.plugin.version = this.currentPluginDefinition.version
    this.plugin.algorithm = this.currentPluginDefinition.algorithm
    this.plugin.status = PluginStatus.Initializing
    yield this.store.native.send('start-salad', {
      name: `${this.currentPluginDefinition.name}-${this.currentPluginDefinition.version}`,
      downloadUrl: this.currentPluginDefinition.downloadUrl,
      exe: this.currentPluginDefinition.exe,
      args: this.currentPluginDefinition.args,
      runningCheck: this.currentPluginDefinition.runningCheck,
      errors: this.currentPluginDefinition.errors,
    })

    console.log(
      `Starting plugin ${this.currentPluginDefinition.name}-${this.currentPluginDefinition.version}: ${this.currentPluginDefinition.exe} ${this.currentPluginDefinition.args}`,
    )

    const gpusNames = this.store.machine.gpus.filter((x) => x && x.model).map((x) => x.model)
    const cpu = this.store.native.machineInfo?.cpu
    const cpuName = `${cpu?.manufacturer} ${cpu?.brand}`

    this.store.analytics.trackStart(
      reason,
      this.gpuMiningEnabled,
      this.cpuMiningEnabled,
      gpusNames,
      cpuName,
      this.gpuMiningOverridden,
      this.cpuMiningOverridden,
    )

    //Show a notification reminding users to use auto start
    if (reason === StartReason.Manual && this.store.autoStart.canAutoStart && !this.store.autoStart.autoStart) {
      this.store.notifications.sendNotification({
        category: NotificationMessageCategory.AutoStart,
        title: 'Salad is best run AFK',
        message: `Don't forget to enable auto start in Settings`,
        id: 123456,
        onClick: () => this.store.routing.push('/settings/desktop-settings'),
      })
    }

    this.startTimestamp = startTimestamp || new Date(Date.now())
    this.runningTime = 0
    this.choppingTime = choppingTime || 0

    this.runningTimer = setInterval(() => {
      runInAction(() => {
        if (!this.startTimestamp) {
          this.runningTime = 0
        } else {
          //Calculates the new total time since we started
          const totalTime = Date.now() - this.startTimestamp.getTime()

          //Checks to see if the miner is confirmed to be running and adds to the chopping time if it is
          if (this.status === MiningStatus.Running) {
            //Calculates the delta since the last timer
            const deltaTime = totalTime - (this.runningTime || 0)

            if (this.choppingTime) {
              this.choppingTime += deltaTime
            } else {
              this.choppingTime = deltaTime
            }
          }

          this.runningTime = totalTime
        }
      })
    }, 1000)

    this.timeoutTimer = setTimeout(() => {
      this.timeoutTimer = undefined
      this.startNext()
    }, this.currentPluginDefinition.initialTimeout)
  })

  @action.bound
  private startNext = flow(function* (this: SaladBowlStore) {
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
      this.store.ui.showErrorPage(ErrorPageType.Fallback)
    } else {
      this.currentPluginDefinition = this.pluginDefinitions[this.currentPluginDefinitionIndex]
      this.plugin.name = this.currentPluginDefinition.name
      this.plugin.version = this.currentPluginDefinition.version
      this.plugin.algorithm = this.currentPluginDefinition.algorithm
      this.plugin.status = PluginStatus.Initializing

      yield this.store.native.send('start-salad', {
        name: `${this.currentPluginDefinition.name}-${this.currentPluginDefinition.version}`,
        downloadUrl: this.currentPluginDefinition.downloadUrl,
        exe: this.currentPluginDefinition.exe,
        args: this.currentPluginDefinition.args,
        runningCheck: this.currentPluginDefinition.runningCheck,
        errors: this.currentPluginDefinition.errors,
      })

      console.log(
        `Starting plugin ${this.currentPluginDefinition.name}-${this.currentPluginDefinition.version}: ${this.currentPluginDefinition.exe} ${this.currentPluginDefinition.args}`,
      )

      this.timeoutTimer = setTimeout(() => {
        this.timeoutTimer = undefined
        this.startNext()
      }, this.currentPluginDefinition.initialTimeout)
    }
  })

  @action
  stop = (reason: StopReason) => {
    if (this.timeoutTimer != null) {
      clearTimeout(this.timeoutTimer)
      this.timeoutTimer = undefined
    }

    if (this.runningTimer) {
      clearInterval(this.runningTimer)
      this.runningTimer = undefined
    }

    this.plugin.name = undefined
    this.plugin.version = undefined
    this.plugin.algorithm = undefined
    this.plugin.status = PluginStatus.Stopped
    this.store.native.send('stop-salad')

    this.store.analytics.trackStop(reason, this.runningTime || 0, this.choppingTime || 0)

    this.startTimestamp = undefined
    console.log('Stopping after running for: ' + this.runningTime + 'and chopping for: ' + this.choppingTime)
    this.runningTime = undefined
    this.choppingTime = undefined
  }

  @action
  setGpuOnly = (value: boolean) => {
    this.cpuMiningEnabled = !value
    this.gpuMiningEnabled = value

    //Saves the new value locally so it will automatically be loaded next time
    Storage.setItem(CPU_MINING_ENABLED, !value)
  }

  @action
  setGpuOverride = (value: boolean) => {
    this.gpuMiningOverridden = value

    //Saves the new value locally so it will automatically be loaded next time
    Storage.setItem(GPU_MINING_OVERRIDDEN, value)
  }

  @action
  setCpuOverride = (value: boolean) => {
    this.cpuMiningOverridden = value

    //Saves the new value locally so it will automatically be loaded next time
    Storage.setItem(CPU_MINING_OVERRIDDEN, value)
  }
}
