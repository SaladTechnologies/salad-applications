import { SBWorkloadState } from '@saladtechnologies/salad-grpc-salad-bowl/salad/grpc/salad_bowl/v1/salad_bowl_pb'
import type { SaladBowlState } from '../../services/SaladFork/models/SaladBowlLoginResponse'
import { MiningStatus } from '../machine/models'
import type { StartActionType, StopReason } from './models'
import { PluginInfo } from './models'

export interface SaladBowlStoreInterface {
  canRun: boolean
  cpuMiningEnabled: boolean
  cpuMiningUpdatePending: boolean
  cpuMiningOverridden: boolean
  cpuMiningOverriddenUpdatePending: boolean
  getSaladBowlState: (saladBowlState?: SaladBowlState) => void
  gpuMiningEnabled: boolean
  gpuMiningUpdatePending: boolean
  gpuMiningOverridden: boolean
  gpuMiningOverriddenUpdatePending: boolean
  isNotCompatible: boolean
  isOverriding: boolean
  isRunning: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  saladBowlConnected?: boolean
  setGpuOnly: (value: boolean) => void
  setGpu: (value: boolean) => void
  setCpu: (value: boolean) => void
  setCpuOverride: (value: boolean) => void
  setGpuOverride: (value: boolean) => void
  setSaladBowlConnected: (value: boolean) => void
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
  workloadState?: SBWorkloadState.AsObject[]
}
