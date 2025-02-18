import type { Moment } from 'moment'

export interface EarningWindow {
  /** Start time for the window */
  timestamp: Moment

  /** Total earnings during the window */
  earnings: number
}

export interface EarningPerMachine {
  [key: string]: EarningWindow[]
}
export interface CurrentHourlyEarningRatesPerMachine {
  [key: string]: number
}

export type ChartDaysShowing = 1 | 7 | 30
