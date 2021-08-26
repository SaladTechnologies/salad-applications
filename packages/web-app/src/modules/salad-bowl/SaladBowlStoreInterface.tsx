import { MiningStatus } from '../machine/models'
import type { ErrorMessage, PluginDefinition, StartActionType, StatusMessage, StopReason } from './models'
import { PluginInfo } from './models'

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
  stop: (reason: StopReason) => void
  toggleRunning: (startAction: StartActionType) => void
}
