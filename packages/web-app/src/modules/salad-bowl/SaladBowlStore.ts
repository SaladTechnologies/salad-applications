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

export class SaladBowlStore {
  private runningHeartbeat?: NodeJS.Timeout
  private currentPluginIndex: number

  @observable
  public plugins: Array<PluginInfo> = new Array()

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
    if (this.plugins[this.this.currentPluginIndex]) {
      return this.plugins[this.currentPluginIndex].status !== PluginStatus.Stopped && this.plugins[this.currentPluginIndex].status !== PluginStatus.Unknown
    } else {
      return false
    }
  }

  @computed
  get status(): MiningStatus {
    if (!this.plugins[this.currentPluginIndex]) {
      return MiningStatus.Stopped
    }

    switch (this.plugins[this.currentPluginIndex].status) {
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
    if (!this.plugins[this.currentPluginIndex]) {
      return MachineStatus.Stopped
    }

    switch (this.plugins[this.currentPluginIndex].status) {
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
    this.currentPluginIndex = 0
    this.store.native.on('mining-status', this.onReceiveStatus)
    this.store.native.on('plugin-change', this.onNextPlugin)
    this.store.native.on('mining-error', this.onReceiveError)
  }

  @action
  onReceiveStatus = (message: StatusMessage) => {
    if (this.plugins[this.currentPluginIndex]) {
      this.plugins[this.currentPluginIndex].name = message.name
      this.plugins[this.currentPluginIndex].status = message.status
    }
  }

  @action
  onNextPlugin = () => {
    this.this.currentPluginIndex += 1
  }

  @action
  onReceiveError = (message: ErrorMessage) => {
    this.store.analytics.trackMiningError(message.errorCategory, message.errorCode)
    // Show the error modal
    switch (message.errorCategory) {
      case ErrorCategory.AntiVirus:
        this.store.ui.showModal('/errors/anti-virus')
        break
      case ErrorCategory.NoCompatiblePlugins:
        if (message.errorCode === 8008135) {
          this.store.ui.showModal('/errors/no-plugins')
        }
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

    this.this.currentPluginIndex = 1
    let pluginDefinitions = getPluginDefinitions(this.store)

    if (pluginDefinitions.length < 1) {
      console.log('Unable to find any valid plugin definitions for this machine. Unable to start.')
      return
    }

    let plugins = []
    for (let i = 0; i < pluginDefinitions.length; i++) {
      let pluginDefinition = pluginDefinitions[i]
      let pluginName = ''
      if (pluginDefinition) {
        pluginName = pluginDefinition.name
      }
      plugins.push({
        name: pluginName,
        status: PluginStatus.Initializing
      })
    }
    this.plugins = plugins

    yield this.store.native.send('start-salad', pluginDefinitions)

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
    if (this.plugins[this.currentPluginIndex]) {
      this.plugins[this.currentPluginIndex].status = PluginStatus.Stopped
    }

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
          this.plugins[this.currentPluginIndex].status = PluginStatus.Initializing
          this.sendRunningStatus(true)
        }
      } else {
        throw e
      }
    }
  })
}
