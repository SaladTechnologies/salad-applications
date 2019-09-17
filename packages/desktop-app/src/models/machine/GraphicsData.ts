/** Taken from si.graphics of SystemInformation */
export interface GraphicsData {
  controllers: GraphicsControllerData[]
  displays: GraphicsDisplayData[]
}

interface GraphicsControllerData {
  vendor: string
  model: string
  bus: string
  vram: number
  vramDynamic: boolean
}

interface GraphicsDisplayData {
  vendor: string
  model: string
  main: boolean
  builtin: boolean
  connection: string
  sizex: number
  sizey: number
  pixeldepth: number
  resolutionx: number
  resolutiony: number
  currentResX: number
  currentResY: number
  positionX: number
  positionY: number
  currentRefreshRate: number
}
