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
    normalizedEarningsPerMachine = earningsPerMachine.reduce((earningsPerMachine, machineEarnings) => {
      if (machineEarnings.earnings) {
        const machineId = machineEarnings.machine_id?.toString() as string
        const earnings = Object.keys(machineEarnings.earnings).map((timestamp: string) => {
          return {
            timestamp: moment(timestamp),
            earnings: (machineEarnings.earnings as Record<string, number>)?.[timestamp] as number,
          }
        })

        return {
          ...earningsPerMachine,
          [machineId]: earnings,
        }
      }

      return earningsPerMachine
    }, {} as EarningPerMachine)
  }

  return normalizedEarningsPerMachine
}
