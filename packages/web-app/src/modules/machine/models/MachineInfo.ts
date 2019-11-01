import { GraphicsData, OsData, SystemData } from '.'

export interface MachineInfo {
  system: SystemData
  os: OsData
  graphics: GraphicsData
}
