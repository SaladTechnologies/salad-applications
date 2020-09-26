import * as si from 'systeminformation'

export interface LinuxGraphicsController {
  vendor?: string
  name?: string
  vram?: number
  driverVersion?: string
}

export interface LinuxGraphicsData {
  controllers?: LinuxGraphicsController[]
  displays?: si.Systeminformation.GraphicsDisplayData[]
}
