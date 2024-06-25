import type { AxiosInstance } from 'axios'
import type { Guid } from 'guid-typescript'
import { action, computed, flow, observable, runInAction } from 'mobx'
import type { Moment } from 'moment'
import moment from 'moment'
import type { RootStore } from '../../Store'
import type { MachinesApiClient } from '../../api/machinesApiClient/generated/machinesApiClient'
import type {
  EarningHistoryTimeframeEnum,
  Machine,
  MachineEarningHistory,
} from '../../api/machinesApiClient/generated/models'
import { getMachinesApiClient } from '../../api/machinesApiClient/getMachinesApiClient'
import type { ChartDaysShowing, EarningPerMachine, EarningWindow } from './models'
import {
  batchEarningsWindow,
  getBaseKeyAsGuid,
  getEarningWindowsGroupedByDay,
  normalizeEarningHistory,
  normalizeEarningsPerMachine,
} from './utils'

enum EarningChartTimeFilter {
  Last24Hour = '24 hour filter',
  Last7Day = '7 day filter',
  Last30Day = '30 day filter',
}

export class BalanceStore {
  private machinesApiClient: MachinesApiClient

  private _latestEarningsPerMachineFetchMoment: Moment | null = null

  @observable
  private _earningsHistory: Map<number, number> = new Map()

  @observable
  private _earningsPerMachine: EarningPerMachine | null = {}

  @observable
  private daysShowingEarnings: ChartDaysShowing = 1

  @observable
  public currentBalance: number = 0

  @observable
  public lifetimeBalance: number = 0

  @observable
  public machines: Machine[] | null = []

  @computed
  public get earningsHistory(): EarningWindow[] {
    return this.getEarningWindows(this.daysShowingEarnings, this._earningsHistory)
  }

  @computed
  public get earningsPerMachine(): EarningPerMachine {
    return this.getEarningWindowsPerMachine(this.daysShowingEarnings)
  }

  @computed
  public get getDaysShowingEarnings(): ChartDaysShowing {
    return this.daysShowingEarnings
  }

  @action
  viewLast24Hours = () => {
    if (this.daysShowingEarnings !== 1) {
      this.store.analytics.trackEarnPageTimeFilterButtonClicked(EarningChartTimeFilter.Last24Hour)
    }

    this.daysShowingEarnings = 1
  }

  @action
  viewLast7Days = () => {
    if (this.daysShowingEarnings !== 7) {
      this.store.analytics.trackEarnPageTimeFilterButtonClicked(EarningChartTimeFilter.Last7Day)
    }

    this.daysShowingEarnings = 7
  }

  @action
  viewLast30Days = () => {
    if (this.daysShowingEarnings !== 30) {
      this.store.analytics.trackEarnPageTimeFilterButtonClicked(EarningChartTimeFilter.Last30Day)
    }

    this.daysShowingEarnings = 30
  }

  /** Total earnings for the last 24 hours */
  @observable
  public lastDayEarnings: number = 0

  /** Total earnings for the last 7 days */
  @observable
  public lastWeekEarnings: number = 0

  /** Total earnings for the last 30 days */
  @observable
  public lastMonthEarnings: number = 0

  private getMachines = async () => {
    try {
      const machinesResponse = await this.machinesApiClient?.v2.machines.get()

      if (machinesResponse?.items) {
        return machinesResponse?.items
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

  @action
  fetchEarningsPerMachine = () => {
    const shouldFetch =
      this._latestEarningsPerMachineFetchMoment === null ||
      moment().diff(this._latestEarningsPerMachineFetchMoment, 'hours') > 0

    if (shouldFetch) {
      this._latestEarningsPerMachineFetchMoment = moment()

      this.getMachines()
        .then((machines) => {
          if (machines) {
            runInAction(() => {
              this.machines = machines
            })
            return this.getEarningsPerMachine(machines, 30)
          }
          throw new Error('There is no machines')
        })
        .then((earningsPerMachine) => {
          if (earningsPerMachine) {
            return runInAction(() => {
              this._earningsPerMachine = normalizeEarningsPerMachine(earningsPerMachine)
            })
          }
          throw new Error('There are no earning per machines')
        })
        .catch((error) => {
          console.error('BalanceStore.getMultipleMachinesEarnings: ', error)
        })
    }
  }

  private getEarningWindowsPerMachine = (chartsDaysShowing: ChartDaysShowing): EarningPerMachine => {
    if (this._earningsPerMachine === null) {
      return {}
    }
    return Object.keys(this._earningsPerMachine).reduce((earningWindowsPerMachine, machineId) => {
      if (!this._earningsPerMachine) {
        return {}
      }

      const machineEarningsMap = this._earningsPerMachine[machineId]?.reduce((machineEarningsMap, item) => {
        machineEarningsMap.set(item.timestamp.unix(), item.earnings)
        return machineEarningsMap
      }, new Map())

      if (!machineEarningsMap) {
        return {}
      }

      return {
        ...earningWindowsPerMachine,
        [machineId]: this.getEarningWindows(chartsDaysShowing, machineEarningsMap),
      }
    }, {} as EarningPerMachine)
  }

  private getEarningWindows = (
    chartsDaysShowing: ChartDaysShowing,
    earningHistory: Map<number, number>,
  ): EarningWindow[] => {
    const windows: EarningWindow[] = []

    const now = moment.utc()

    const threshold = moment(now).subtract(chartsDaysShowing, 'days')

    let batchedEarningWindows = new Map<number, number>()
    switch (chartsDaysShowing) {
      case 1:
        batchedEarningWindows = earningHistory
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

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {
    this.machinesApiClient = getMachinesApiClient(axios)
  }

  @action.bound
  refreshBalanceAndHistory = flow(function* (this: BalanceStore) {
    yield Promise.allSettled([this.refreshBalance(), this.refreshBalanceHistory()])
  })

  @action.bound
  refreshBalance = flow(function* (this: BalanceStore) {
    try {
      const response = yield this.axios.get('/api/v1/profile/balance')
      this.currentBalance = response.data.currentBalance
      this.lifetimeBalance = response.data.lifetimeBalance
    } catch (error) {
      console.error('Balance error: ')
      console.error(error)
    }
  })

  @action.bound
  refreshBalanceHistory = flow(function* (this: BalanceStore) {
    try {
      const response = yield this.axios.get('/api/v2/reports/30-day-earning-history')

      const earningData = response.data

      const { lastMonthEarnings, lastWeekEarnings, lastDayEarnings, earningHistory } =
        normalizeEarningHistory(earningData)

      this.lastMonthEarnings = lastMonthEarnings
      this.lastWeekEarnings = lastWeekEarnings
      this.lastDayEarnings = lastDayEarnings
      this._earningsHistory = earningHistory
    } catch (error) {
      console.error('Balance history error: ')
      console.error(error)
    }
  })
}
