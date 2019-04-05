import { OperatingSystem } from './OperatingSystem'
import { GPUDevice } from './GPUDevice'
import { SystemData } from './SystemData'
export interface MachineInfo {
  system: SystemData
  os: OperatingSystem
  gpus: GPUDevice[]
}
