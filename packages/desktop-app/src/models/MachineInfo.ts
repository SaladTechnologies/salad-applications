import { Systeminformation } from 'systeminformation'

export interface MachineInfo {
  macAddress: string
  version: string
  system: Systeminformation.SystemData
  os: Systeminformation.OsData
  gpus: Systeminformation.GraphicsControllerData[]
}
