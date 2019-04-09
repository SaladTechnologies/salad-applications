import { Systeminformation } from 'systeminformation'

export interface MachineInfo {
  macAddress: string
  system: Systeminformation.SystemData
  os: Systeminformation.OsData
  gpus: Systeminformation.GraphicsControllerData[]
}
