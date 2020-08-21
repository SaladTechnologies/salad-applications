import * as si from 'systeminformation'

export interface MachineInfo {
  cpu?: si.Systeminformation.CpuData | si.Systeminformation.CpuWithFlagsData
  graphics?: si.Systeminformation.GraphicsData
  memLayout?: si.Systeminformation.MemLayoutData[]
  os?: si.Systeminformation.OsData
  services?: si.Systeminformation.ServicesData[]
  system?: si.Systeminformation.SystemData
  uuid?: si.Systeminformation.UuidData
  version?: string
}
