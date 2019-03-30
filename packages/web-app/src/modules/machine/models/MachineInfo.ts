import { OperatingSystem } from './OperatingSystem'
import { GPUDevice } from './GPUDevice'
export interface MachineInfo {
  os: OperatingSystem
  gpus: GPUDevice[]
}
