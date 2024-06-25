import { Guid } from 'guid-typescript'
import { chunk, groupBy } from 'lodash'
import moment from 'moment'
import type { MachineEarningHistory } from '../../api/machinesApiClient/generated/models'
import type { EarningPerMachine, EarningWindow } from './models'

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

export const getEarningWindowsGroupedByDay = (
  earningWindows: EarningWindow[],
  numberOfDays: 7 | 30,
): EarningWindow[] => {
  const groupedByTheDayEarningWindows = groupBy(earningWindows, (item) => moment(item.timestamp).endOf('day').unix())

  const accumulatedEarningsByTheDay = Object.values(groupedByTheDayEarningWindows).map((day) =>
    day.reduce((acc, curr) => ({
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

export type BaseKey = string | number

export const getBaseKeyAsGuid = (key: BaseKey | Guid): Guid => {
  // TODO: Do not force to string and bypass type check (after Kiota is fixed).
  // https://github.com/microsoft/kiota-typescript/issues/1113
  if (key instanceof Guid) {
    return key.toString() as unknown as Guid
  }
  return Guid.parse(key.toString()).toString() as unknown as Guid
}

export const normalizeEarningsPerMachine = (
  earningsPerMachine: MachineEarningHistory[] | null,
): EarningPerMachine | null => {
  let normalizedEarningsPerMachine: EarningPerMachine | null = null
  if (earningsPerMachine) {
    normalizedEarningsPerMachine = earningsPerMachine.reduce((aggregatedEarningsPerMachine, machineEarnings) => {
      if (machineEarnings.earnings) {
        const machineId = machineEarnings.machine_id?.toString() as string
        const { earningHistory: earningHistoryMap } = normalizeEarningHistory(
          machineEarnings.earnings as Record<string, number>,
        )

        const machineEarningHistory = Object.fromEntries(earningHistoryMap.entries())

        const earnings = Object.keys(machineEarningHistory).map((timestamp: string) => {
          const timestampMoment = moment(Number(timestamp) * 1000)
          return {
            timestamp: timestampMoment,
            earnings: machineEarningHistory[timestamp] ?? 0,
          }
        })

        return {
          ...aggregatedEarningsPerMachine,
          [machineId]: earnings,
        }
      }

      return aggregatedEarningsPerMachine
    }, {} as EarningPerMachine)

    return normalizedEarningsPerMachine
  }

  return null
}

export const normalizeEarningHistory = (
  earningData: Record<string, number>,
): {
  lastMonthEarnings: number
  lastWeekEarnings: number
  lastDayEarnings: number
  earningHistory: Map<number, number>
} => {
  const roundedDown = Math.floor(moment().minute() / 15) * 15

  const now = moment().minute(roundedDown).second(0).millisecond(0)

  const threshold24Hrs = moment(now).subtract(24, 'hours')
  const threshold7Days = moment(now).subtract(7, 'days')

  const earningValues: Map<number, number> = new Map()

  let total24Hrs = 0
  let total7Days = 0
  let total30Days = 0

  //Process the input data into a usable format
  for (let key in earningData) {
    const timestamp = moment(key)
    const earnings: number = earningData[key] as number
    earningValues.set(timestamp.unix(), earnings)

    if (timestamp >= threshold24Hrs) {
      total24Hrs += earnings
    }

    if (timestamp >= threshold7Days) {
      total7Days += earnings
    }

    total30Days += earnings
  }

  const history = new Map<number, number>()

  for (let i = 0; i < 2880; ++i) {
    const earning = earningValues.get(now.unix())
    history.set(now.unix(), earning || 0)
    now.subtract(15, 'minutes')
  }

  return {
    lastMonthEarnings: total30Days,
    lastWeekEarnings: total7Days,
    lastDayEarnings: total24Hrs,
    earningHistory: history,
  }
}
