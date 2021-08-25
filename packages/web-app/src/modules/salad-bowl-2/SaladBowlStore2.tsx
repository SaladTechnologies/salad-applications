import { computed, observable } from 'mobx'
import { RootStore } from '../../Store'
import { MiningStatus } from '../machine/models'
import type { ErrorMessage, PluginDefinition, StartActionType, StatusMessage, StopReason } from '../salad-bowl/models'
import { PluginInfo } from '../salad-bowl/models'

export interface SaladBowlStoreInterface {
  canRun: boolean
  cpuMiningEnabled: boolean
  cpuMiningOverridden: boolean
  getSavedData: () => object
  gpuMiningEnabled: boolean
  gpuMiningOverridden: boolean
  isNotCompatible: boolean
  isOverriding: boolean
  isRunning: boolean
  onDataLoaded: (data: unknown) => void
  onReceiveStatus: (message: StatusMessage) => void
  onReceiveError: (message: ErrorMessage) => void
  setGpuOnly: (value: boolean) => void
  setCpuOverride: (value: boolean) => void
  setGpuOverride: (value: boolean) => void
  plugin: PluginInfo
  pluginCount: number
  pluginDefinitions: PluginDefinition[]
  preppingProgress: number
  runningTime?: number
  runningTimeDisplay:
    | {
        value: number
        unit: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second'
      }
    | undefined
  status: MiningStatus
  toggleRunning: (startAction: StartActionType) => void
}

export class SaladBowlStore2 implements SaladBowlStoreInterface {
  @observable
  public runningTime?: number = undefined

  @observable
  public cpuMiningEnabled = false

  @observable
  public gpuMiningEnabled = true

  @observable
  public cpuMiningOverridden = false

  @observable
  public gpuMiningOverridden = false

  @observable
  public plugin = new PluginInfo()

  @computed
  get pluginDefinitions(): PluginDefinition[] {
    return []
  }

  @computed
  get canRun() {
    return true
  }

  @computed
  get pluginCount() {
    return this.pluginDefinitions.length
  }

  @computed
  get isRunning() {
    return false
  }

  @computed
  get isNotCompatible() {
    return !this.canRun
  }

  @computed
  get isOverriding() {
    return this.gpuMiningOverridden || this.cpuMiningOverridden
  }

  @computed
  get status() {
    return MiningStatus.Stopped
  }

  @computed
  get preppingProgress() {
    return 0
  }

  @computed
  get runningTimeDisplay():
    | {
        value: number
        unit: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second'
      }
    | undefined {
    return undefined
  }

  constructor(private readonly store: RootStore) {}

  start = () => {}

  startNext = () => {}

  stop = (stopReason: StopReason) => {
    console.log(stopReason)
    this.store.saladFork.logout()
  }

  getSavedData = () => {
    return {}
  }

  onDataLoaded = (data: unknown) => {
    console.log(data)
  }

  onReceiveStatus = (message: StatusMessage) => {
    console.log(message)
  }

  onReceiveError = (message: ErrorMessage) => {
    console.log(message)
  }

  toggleRunning = (startAction: StartActionType) => {
    console.log(startAction)
  }

  setGpuOnly = (value: boolean) => {
    console.log(value)
  }

  setCpuOverride = (value: boolean) => {
    console.log(value)
  }

  setGpuOverride = (value: boolean) => {
    console.log(value)
  }
}
