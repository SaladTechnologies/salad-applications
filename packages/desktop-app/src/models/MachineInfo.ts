import { Systeminformation } from 'systeminformation'

export interface MachineInfo {
  os: Systeminformation.OsData
  gpus: Systeminformation.GraphicsControllerData[]
}
