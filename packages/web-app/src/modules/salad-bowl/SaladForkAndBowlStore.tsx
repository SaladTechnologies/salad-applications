import { computed, observable } from 'mobx'
import { RootStore } from '../../Store'
import { MiningStatus } from '../machine/models'
import type { ErrorMessage, PluginDefinition, StartActionType, StatusMessage, StopReason } from './models'
import { PluginInfo, StartReason } from './models'
import { SaladBowlStoreInterface } from './SaladBowlStoreInterface'

export class SaladForkAndBowlStore implements SaladBowlStoreInterface {
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

  private start = (reason: StartReason, startTimestamp?: Date, choppingTime?: number) => {
    console.log(reason)
    console.log(startTimestamp)
    console.log(choppingTime)
  }

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
    this.start(StartReason.Automatic, undefined, undefined)
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
