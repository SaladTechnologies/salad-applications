import moment from 'moment'
import type { ChartDaysShowing, EarningWindow } from '../balance/models'

export const getTooltipTimestamp = (daysShowing: ChartDaysShowing, timestamp: Object): string => {
  let displayTime: string
  switch (daysShowing) {
    case 1:
      displayTime = moment(timestamp).add(15, 'minute').format('LT')
      break
    case 7:
      displayTime =
        moment(timestamp).add(15, 'minute').format('LT') +
        ' - ' +
        moment(timestamp).add(15, 'minute').add(2, 'hour').format('LT')
      break
    case 30:
      displayTime =
        moment(timestamp).add(15, 'minute').format('M/D') + ' ' + moment(timestamp).add(15, 'minute').format('A')
      break
    default:
      displayTime = moment(timestamp).add(15, 'minute').format('LT')
  }

  return displayTime
}

interface RangeTooltipTimestamp {
  startTime: string
  endTime: string
}

export const getRangeTooltipTimestamp = (
  daysShowing: ChartDaysShowing,
  startTime: Object,
  endTime: Object,
): RangeTooltipTimestamp => {
  let rangeDisplayTimes = {
    startTime: '',
    endTime: '',
  }
  switch (daysShowing) {
    case 1:
      rangeDisplayTimes.startTime = moment(startTime).add(15, 'minute').format('LT')
      rangeDisplayTimes.endTime = moment(endTime).add(15, 'minute').format('LT')
      break
    case 7:
      rangeDisplayTimes.startTime =
        moment(startTime).add(15, 'minute').format('M/D') +
        ' ' +
        moment(startTime).add(15, 'minute').add(2, 'hour').format('LT')
      rangeDisplayTimes.endTime =
        moment(endTime).add(15, 'minute').format('M/D') +
        ' ' +
        moment(endTime).add(15, 'minute').add(2, 'hour').format('LT')
      break
    case 30:
      rangeDisplayTimes.startTime =
        moment(startTime).add(15, 'minute').format('M/D') + ' ' + moment(startTime).add(15, 'minute').format('A')
      rangeDisplayTimes.endTime =
        moment(endTime).add(15, 'minute').format('M/D') + ' ' + moment(endTime).add(15, 'minute').format('A')
      break
    default:
      rangeDisplayTimes.startTime = moment(startTime).add(15, 'minute').format('LT')
      rangeDisplayTimes.endTime = moment(endTime).add(15, 'minute').format('LT')
      break
  }

  return rangeDisplayTimes
}

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
        timestamp: moment(earningPerMachine.timestamp).add(15, 'minute').format('D'),
        earnings: earningPerMachine.earnings,
      }
    }
  })
}
