import { chunk, groupBy } from 'lodash'
import moment from 'moment'
import type { EarningWindow } from './models'

export const batchEarningsWindow = (earnings: Map<number, number>, batchSize: number): Map<number, number> => {
  const earningHistory = new Map<number, number>()
  const array = Array.from(earnings, ([timestamp, earnings]) => ({ timestamp, earnings }))
  const chunkArray = chunk(array, batchSize)

  for (var i = 0; i < chunkArray.length; i++) {
    let earning = 0
    chunkArray[i]!.forEach((item) => (earning += item.earnings))
    earningHistory.set(chunkArray[i]![batchSize - 1]!.timestamp, earning || 0)
  }
  return earningHistory
}

export const getEarningWindowsGrouppedByDay = (
  earningWindows: EarningWindow[],
  numberOfDays: 7 | 30,
): EarningWindow[] => {
  const grouppedByTheDayEarningWindows = groupBy(earningWindows, (item) => moment(item.timestamp).endOf('day').unix())

  const accumulatedEarningsByTheDay = Object.values(grouppedByTheDayEarningWindows).map((item) =>
    item.reduce((acc, curr) => ({
      ...acc,
      earnings: acc.earnings + curr.earnings,
    })),
  )

  const chunkedDaysPeriodEarnings =
    accumulatedEarningsByTheDay.length === numberOfDays
      ? accumulatedEarningsByTheDay
      : accumulatedEarningsByTheDay.slice(accumulatedEarningsByTheDay.length - numberOfDays)

  return chunkedDaysPeriodEarnings
}
