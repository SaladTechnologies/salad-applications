import moment from 'moment'
import type { EarningWindow } from '../balance/models'

export const getTooltipTimestamp = (daysShowing: 1 | 7 | 30, timestamp: Object): string => {
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
  daysShowing: 1 | 7 | 30,
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

export const getIntervalEarnings = (earningHistory: EarningWindow[]): number => {
  if (earningHistory.length > 0) {
    return earningHistory.reduce((n, { earnings }) => n + earnings, 0)
  } else {
    return 0
  }
}

export const getNumberWithCommas = (number: string): string => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
