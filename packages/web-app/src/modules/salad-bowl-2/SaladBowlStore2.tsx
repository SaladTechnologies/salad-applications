import { computed, observable } from 'mobx'
import { RootStore } from '../../Store'
import { MiningStatus } from '../machine/models'
import type { PluginDefinition, StatusMessage } from '../salad-bowl/models'
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
  onReceiveError: (message: StatusMessage) => void
  setGpuOnly: () => void
  setCpuOverride: () => void
  setGpuOverride: () => void
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
  toggleRunning: () => void
}

export class SaladBowlStore2 implements SaladBowlStoreInterface {
  @observable
  public runningTime = undefined

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
  get pluginDefinitions() {
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
  get runningTimeDisplay() {
    return undefined
  }

  constructor(private readonly store: RootStore) {}

  start = () => {}

  startNext = () => {}

  stop = () => {
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

  onReceiveError = (message: StatusMessage) => {
    console.log(message)
  }

  toggleRunning = () => {}

  setGpuOnly = () => {}

  setCpuOverride = () => {}

  setGpuOverride = () => {}
}
