import { chunk } from 'lodash'

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
