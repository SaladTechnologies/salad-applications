export interface Machine {
  id: string
  name: string
  minerId: string
  qualifying: boolean
  validOs: boolean
  validGpus: boolean
  /** Earning rate for the machine (USD/s) */
  earningRate: number
}
