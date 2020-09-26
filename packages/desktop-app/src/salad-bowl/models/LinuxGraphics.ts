import * as si from 'systeminformation'

export interface LinuxGraphicsController {
  vendor?: string
  model?: string
  vram?: number
  driverVersion?: string
}

export interface LinuxGraphicsData {
  controllers?: LinuxGraphicsController[]
  displays?: si.Systeminformation.GraphicsDisplayData[]
}
