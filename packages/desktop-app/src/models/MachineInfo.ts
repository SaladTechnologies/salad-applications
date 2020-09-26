import * as si from 'systeminformation'
import { LinuxGraphicsData } from '../salad-bowl/models/LinuxGraphics'

export interface MachineInfo {
  cpu?: si.Systeminformation.CpuData | si.Systeminformation.CpuWithFlagsData
  graphics?: si.Systeminformation.GraphicsData | LinuxGraphicsData
  memLayout?: si.Systeminformation.MemLayoutData[]
  os?: si.Systeminformation.OsData
  platform?: 'aix' | 'android' | 'cygwin' | 'darwin' | 'freebsd' | 'linux' | 'netbsd' | 'openbsd' | 'sunos' | 'win32'
  services?: si.Systeminformation.ServicesData[]
  system?: si.Systeminformation.SystemData
  uuid?: si.Systeminformation.UuidData
  version?: string
}
