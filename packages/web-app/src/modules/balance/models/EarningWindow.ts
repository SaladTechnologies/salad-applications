import { Moment } from 'moment'

export interface EarningWindow {
  /** Start time for the window */
  timestamp: Moment

  /** Total earnings during the window */
  earnings: number
}
