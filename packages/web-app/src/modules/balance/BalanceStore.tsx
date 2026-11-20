import type { AxiosInstance } from 'axios'
import type { Guid } from 'guid-typescript'
import { DateTime } from 'luxon'
import moment from 'moment'
import type { MachinesApiClient } from '../../api/machinesApiClient/generated/machinesApiClient'
import type {
  EarningHistoryTimeframeEnum,
  Machine,
  MachineEarningHistory,
} from '../../api/machinesApiClient/generated/models'
import { getMachinesApiClient } from '../../api/machinesApiClient/getMachinesApiClient'
import type { ExternalState } from '../../app/external-state.ts'
import { createExternalState } from '../../app/external-state.ts'
import type { ChartDaysShowing, CurrentHourlyEarningRatesPerMachine, EarningPerMachine, EarningWindow } from './models'
import {
  batchEarningsWindow,
  getBaseKeyAsGuid,
  getEarningWindowsGroupedByDay,
  getMachineEarningRateEndpointPath,
  normalizeEarningHistory,
  normalizeEarningsPerMachine,
} from './utils'

/** The balance, the earnings totals and histories, and the machines, which the pages read with `useExternalState`. */
export interface BalanceState {
  /** The balance the user can spend. */
  currentBalance: number
  /** Everything the user has earned. */
  lifetimeBalance: number
  /** Total earnings for the last 24 hours. */
  lastDayEarnings: number
  /** Total earnings for the last 7 days. */
  lastWeekEarnings: number
  /** Total earnings for the last 30 days. */
  lastMonthEarnings: number
  /** Each machine's 30-day earning history, as loaded. */
  loadedEarningsPerMachine: EarningPerMachine | null
  /** How many days the earning charts show. */
  daysShowingEarnings: ChartDaysShowing
  /** Each machine's current hourly earning rate. */
  currentHourlyEarningRatesPerMachine: CurrentHourlyEarningRatesPerMachine
  /** The machines seen in the last 32 days. */
  machines: Machine[] | null
}

/** The state before anything has loaded, and after sign-out. The chart range is not the user's data, so it stays. */
const emptyBalance: Omit<BalanceState, 'daysShowingEarnings'> = {
  currentBalance: 0,
  lifetimeBalance: 0,
  lastDayEarnings: 0,
  lastWeekEarnings: 0,
  lastMonthEarnings: 0,
  loadedEarningsPerMachine: {},
  currentHourlyEarningRatesPerMachine: {},
  machines: [],
}

/** Returns the earning windows to chart for `chartsDaysShowing` days, batched and, past one day, grouped by day. */
const getEarningWindows = (
  chartsDaysShowing: ChartDaysShowing,
  earningHistory: Map<number, number>,
  isPerMachineEarning?: boolean,
): EarningWindow[] => {
  const windows: EarningWindow[] = []

  const now = moment.utc()

  const threshold = moment(now).subtract(chartsDaysShowing, 'days')

  let batchedEarningWindows = new Map<number, number>()
  switch (chartsDaysShowing) {
    case 1:
      batchedEarningWindows = isPerMachineEarning ? batchEarningsWindow(earningHistory, 4) : earningHistory
      break
    case 7:
      batchedEarningWindows = batchEarningsWindow(earningHistory, 8)
      break
    case 30:
      batchedEarningWindows = batchEarningsWindow(earningHistory, 48)
      break
    default:
      batchedEarningWindows = earningHistory
  }

  for (let [unixTime, earning] of batchedEarningWindows) {
    const time = moment.unix(unixTime)

    if (time >= threshold) {
      windows.push({
        timestamp: time,
        earnings: earning,
      })
    }
  }

  const sortedEarningWindowsByTimestamp = windows.sort((a, b) => a.timestamp.diff(b.timestamp))

  if (chartsDaysShowing === 1) {
    return sortedEarningWindowsByTimestamp
  }

  const groupedByTheDayEarningWindows = getEarningWindowsGroupedByDay(
    sortedEarningWindowsByTimestamp,
    chartsDaysShowing,
  )

  return groupedByTheDayEarningWindows
}

/** Returns each machine's earning windows to chart, as the MobX store's `earningsPerMachine` computed them. */
export const earningsPerMachineOf = (
  loadedEarningsPerMachine: EarningPerMachine | null,
  daysShowingEarnings: ChartDaysShowing,
): EarningPerMachine => {
  if (loadedEarningsPerMachine === null) {
    return {}
  }
  return Object.keys(loadedEarningsPerMachine).reduce((earningWindowsPerMachine, machineId) => {
    const machineEarningsMap = loadedEarningsPerMachine[machineId]?.reduce((machineEarningsMap, item) => {
      machineEarningsMap.set(item.timestamp.unix(), item.earnings)
      return machineEarningsMap
    }, new Map())

    if (!machineEarningsMap) {
      return {}
    }

    return {
      ...earningWindowsPerMachine,
      [machineId]: getEarningWindows(daysShowingEarnings, machineEarningsMap, true),
    }
  }, {} as EarningPerMachine)
}

/**
 * The balance and earnings. The state is held outside MobX (`state`), which pages read with `useExternalState`; the
 * actions keep the MobX store's steps and order.
 */
export class BalanceStore {
  private readonly machinesApiClient: MachinesApiClient

  private readonly axios: AxiosInstance

  /** The balance, earnings and machines. A change makes a new state. */
  public readonly state: ExternalState<BalanceState> = createExternalState<BalanceState>({
    ...emptyBalance,
    daysShowingEarnings: 1,
  })

  constructor(axios: AxiosInstance) {
    this.axios = axios
    this.machinesApiClient = getMachinesApiClient(axios)
  }

  viewLast24Hours = () => {
    this.state.update({ daysShowingEarnings: 1 })
  }

  viewLast7Days = () => {
    this.state.update({ daysShowingEarnings: 7 })
  }

  viewLast30Days = () => {
    this.state.update({ daysShowingEarnings: 30 })
  }

  private getMachines = async () => {
    try {
      const machinesResponse = await this.machinesApiClient?.v2.machines.get()

      if (machinesResponse?.items) {
        const machines = machinesResponse?.items.filter((machine) => {
          if (machine.update_time) {
            return DateTime.fromJSDate(machine.update_time) > DateTime.now().minus({ days: 32 })
          }
          return false
        })

        if (machines.length > 0) {
          this.state.update({ machines })
          return this.state.get().machines
        }
      }
    } catch (error) {
      console.error('BalanceStore.getMultipleMachinesEarnings: ', error)
    }

    return null
  }

  private getEarningsPerMachine = async (machines: Machine[], chartsDaysShowing: ChartDaysShowing) => {
    try {
      return (
        await Promise.all(
          machines
            .filter((machine) => machine.machine_id)
            .map((machine) => {
              const timeframe: EarningHistoryTimeframeEnum =
                chartsDaysShowing === 1 ? '24h' : (`${chartsDaysShowing}d` as EarningHistoryTimeframeEnum)
              return this.machinesApiClient?.v2.machines
                .byMachine_id(getBaseKeyAsGuid(machine.machine_id as Guid))
                .earningHistory.get({ queryParameters: { timeframe } })
            }),
        )
      ).filter((value) => value) as MachineEarningHistory[]
    } catch (error) {
      console.error('BalanceStore.getEarningsPerMachine: ', error)
      return null
    }
  }

  public getCurrentEarningRatesPerMachine = async (machineIds: string[]) => {
    try {
      return (
        await Promise.all(
          machineIds.map((machineId) => {
            return this.axios.get(getMachineEarningRateEndpointPath(machineId))
          }),
        )
      ).reduce((currentHourlyEarningRatesPerMachine, response, index) => {
        const machineId = machineIds[index]
        if (machineId) {
          return { ...currentHourlyEarningRatesPerMachine, [machineId.toString()]: response.data * 12 }
        }
        return currentHourlyEarningRatesPerMachine
      }, {} as CurrentHourlyEarningRatesPerMachine)
    } catch (error) {
      console.error('BalanceStore.getCurrentEarningRatesPerMachine: ', error)
      return null
    }
  }

  /**
   * Loads the machines and the current hourly earning rates of `machineIds` (all machines when omitted) into the store.
   * The earnings pages' rates query (`src/earnings/machine-earnings.ts`) runs it. Errors are logged, not thrown.
   */
  loadCurrentEarningRatesPerMachine = (machineIds?: string[]): Promise<void> =>
    this.getMachines()
      .then((machines) => {
        if (machines === null) {
          throw new Error('There is no machines')
        }

        return machineIds
          ? machineIds
          : (machines
              .filter((machine) => machine.machine_id)
              .map((machine) => machine.machine_id?.toString()) as string[])
      })
      .then((machinesIds) => {
        return this.getCurrentEarningRatesPerMachine(machinesIds)
      })
      .then((currentHourlyEarningRatesPerMachine) => {
        if (currentHourlyEarningRatesPerMachine) {
          this.state.update({
            currentHourlyEarningRatesPerMachine: {
              ...this.state.get().currentHourlyEarningRatesPerMachine,
              ...currentHourlyEarningRatesPerMachine,
            },
          })
          return
        }
        throw new Error('There are no current earning rates per machine id')
      })
      .catch((error) => {
        console.error('BalanceStore.loadCurrentEarningRatesPerMachine: ', error)
      })

  /**
   * Loads the machines and their 30-day earning histories into the store. The earnings pages' history query
   * (`src/earnings/machine-earnings.ts`) runs it, at most once an hour. Errors are logged, not thrown.
   */
  loadEarningsPerMachine = (): Promise<void> =>
    this.getMachines()
      .then((machines) => {
        if (machines === null) {
          throw new Error('There is no machines')
        }

        return this.getEarningsPerMachine(machines, 30)
      })
      .then((earningsPerMachine) => {
        if (earningsPerMachine) {
          this.state.update({ loadedEarningsPerMachine: normalizeEarningsPerMachine(earningsPerMachine) })
          return
        }
        throw new Error('There are no earning per machines')
      })
      .catch((error) => {
        console.error('BalanceStore.loadEarningsPerMachine: ', error)
      })

  refreshBalanceAndHistory = async (): Promise<void> => {
    await Promise.allSettled([this.refreshBalance(), this.refreshBalanceHistory()])
  }

  refreshBalance = async (): Promise<void> => {
    try {
      const response = await this.axios.get('/api/v1/profile/balance')
      this.state.update({
        currentBalance: response.data.currentBalance,
        lifetimeBalance: response.data.lifetimeBalance,
      })
    } catch (error) {
      console.error('Balance error: ')
      console.error(error)
    }
  }

  refreshBalanceHistory = async (): Promise<void> => {
    try {
      const response = await this.axios.get('/api/v2/reports/30-day-earning-history')

      const earningData = response.data

      const { lastMonthEarnings, lastWeekEarnings, lastDayEarnings } = normalizeEarningHistory(earningData)

      this.state.update({ lastMonthEarnings, lastWeekEarnings, lastDayEarnings })
    } catch (error) {
      console.error('Balance history error: ')
      console.error(error)
    }
  }

  /** Forgets the balance and earnings of the user who signed out, so the next user never sees them. */
  resetUserData = () => {
    this.state.update(emptyBalance)
  }
}
