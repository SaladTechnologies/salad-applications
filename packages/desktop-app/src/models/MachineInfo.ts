import { Systeminformation } from 'systeminformation'

export interface MachineInfo {
  system: Systeminformation.SystemData
  os: Systeminformation.OsData
  gpus: Systeminformation.GraphicsControllerData[]
}
