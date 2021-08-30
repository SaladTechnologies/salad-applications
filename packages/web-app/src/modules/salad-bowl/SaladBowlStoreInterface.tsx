import { MiningStatus } from '../machine/models'
import type { StartActionType, StopReason } from './models'
import { PluginInfo } from './models'

export interface SaladBowlStoreInterface {
  canRun: boolean
  cpuMiningEnabled: boolean
  cpuMiningOverridden: boolean
  gpuMiningEnabled: boolean
  gpuMiningOverridden: boolean
  isNotCompatible: boolean
  isOverriding: boolean
  isRunning: boolean
  setGpuOnly: (value: boolean) => void
  setCpuOverride: (value: boolean) => void
  setGpuOverride: (value: boolean) => void
  plugin: PluginInfo
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
