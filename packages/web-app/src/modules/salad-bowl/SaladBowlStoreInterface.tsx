import type { SaladBowlState } from '../../services/SaladFork/models/SaladBowlLoginResponse'
import { MiningStatus } from '../machine/models'
import type { StartActionType, StopReason } from './models'
import { PluginInfo } from './models'

export interface SaladBowlStoreInterface {
  canRun: boolean
  cpuMiningEnabled: boolean
  cpuMiningOverridden: boolean
  getSaladBowlState: (saladBowlState?: SaladBowlState) => void
  gpuMiningEnabled: boolean
  gpuMiningOverridden: boolean
  isNotCompatible: boolean
  isOverriding: boolean
  isRunning: boolean
  setGpuOnly: (value: boolean) => void
  setGpu: (value: boolean) => void
  setCpu: (value: boolean) => void
  setGpuAndCpu: () => void
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
