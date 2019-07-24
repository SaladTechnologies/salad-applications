import { OperatingSystem } from './OperatingSystem'
import { GPUDevice } from './GPUDevice'
import { SystemData } from './SystemData'

export interface MachineInfo {
  macAddress: string
  version: string
  system: SystemData
  os: OperatingSystem
  gpus: GPUDevice[]
  machineId?: string
}
