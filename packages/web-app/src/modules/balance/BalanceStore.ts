import { AxiosInstance } from 'axios'
import { action, autorun, computed, flow, observable } from 'mobx'
import moment from 'moment'
import { RootStore } from '../../Store'
import { EarningWindow } from './models'

export class BalanceStore {
  @observable
  public currentBalance: number = 0

  @observable
  public lifetimeBalance: number = 0

  @observable
  private earningHistory: Map<number, number> = new Map()

  @computed
  public get lastDayEarningWindows(): EarningWindow[] {
    return this.getEarningWindows(1)
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

  private getEarningWindows = (numberOfDays: number): EarningWindow[] => {
    const windows: EarningWindow[] = []

    const now = moment.utc()

    for (let [unixTime, earning] of this.earningHistory) {
      const time = moment.unix(unixTime)

      //Delta time (days)
      const deltaTime = now.diff(time, 'hours')

      if (deltaTime <= numberOfDays * 24) {
        windows.push({
          timestamp: time,
          earnings: earning,
        })
      }
    }

    return windows.sort((a, b) => a.timestamp.diff(b.timestamp))
  }

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {
    autorun(() => {
      this.store?.analytics?.trackLifetimeBalance?.(this.lifetimeBalance)
    })
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
        const earnings: number = earningData[key]
        earningValues.set(timestamp.unix(), earnings)

        if (timestamp >= threshold24Hrs) {
          total24Hrs += earnings
        }

        if (timestamp >= threshold7Days) {
          total7Days += earnings
        }

        total30Days += earnings
      }

      this.lastMonthEarnings = total30Days
      this.lastWeekEarnings = total7Days
      this.lastDayEarnings = total24Hrs

      const history = new Map<number, number>()

      for (let i = 0; i < 2880; ++i) {
        const ts = now.subtract(15, 'minutes')
        const earning = earningValues.get(ts.unix())
        history.set(ts.unix(), earning || 0)
      }

      this.earningHistory = history

      console.error('Refreshed balance history')
    } catch (error) {
      console.error('Balance history error: ')
      console.error(error)
    }
  })
}
