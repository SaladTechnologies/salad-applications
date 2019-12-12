import moment from 'moment'

export interface BalanceEvent {
  id: number
  deltaBalance: number
  timestamp: moment.Moment
}
