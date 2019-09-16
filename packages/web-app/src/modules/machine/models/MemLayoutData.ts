/** Taken from si.memLayout of SystemInformation */
export interface MemLayoutData {
  size: number
  bank: string
  type: string
  clockSpeed: number
  formFactor: string
  partNum: string
  serialNum: string
  voltageConfigured: number
  voltageMin: number
  voltageMax: number
}
