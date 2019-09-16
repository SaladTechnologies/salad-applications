import {
  BiosData,
  BaseboardData,
  ChassisData,
  CpuWithFlagsData,
  DiskLayoutData,
  GraphicsData,
  MemLayoutData,
  NetworkInterfacesData,
  OsData,
  SystemData,
  UuidData,
  VersionData,
} from '.'

export interface MachineInfo {
  version: string
  system: SystemData
  bios: BiosData
  baseboard: BaseboardData
  chassis: ChassisData
  os: OsData
  uuid: UuidData
  versions: VersionData
  cpu: CpuWithFlagsData
  graphics: GraphicsData
  net: NetworkInterfacesData[]
  memLayout: MemLayoutData[]
  diskLayout: DiskLayoutData[]
}
