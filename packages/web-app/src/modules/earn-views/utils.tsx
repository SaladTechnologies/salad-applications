import moment from 'moment'
import type { EarningWindow } from '../balance/models'
export const getNumberWithCommas = (number: string): string => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const normalizeEarningsPerMachineData = (earningPerMachine: EarningWindow[], daysShowing: number) => {
  const is24HoursChart = daysShowing === 1
  const is7DaysChart = daysShowing === 7

  return earningPerMachine.map((earningPerMachine) => {
    if (is24HoursChart) {
      return {
        timestamp: moment(earningPerMachine.timestamp).add(15, 'minute').format('HH'),
        earnings: earningPerMachine.earnings,
      }
    } else if (is7DaysChart) {
      return {
        timestamp: moment(earningPerMachine.timestamp).add(15, 'minute').format('D/M'),
        earnings: earningPerMachine.earnings,
      }
    } else {
      return {
        timestamp: moment(earningPerMachine.timestamp).add(15, 'minute').format('D/M'),
        earnings: earningPerMachine.earnings,
      }
    }
  })
}
