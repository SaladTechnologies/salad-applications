import { action, observable, flow, autorun, computed } from 'mobx'
import { RootStore } from '../../Store'
import { AxiosInstance } from 'axios'
import { EarningWindow } from './models'

/** The earning history bucket size (ms) */
const bucketSize = 1000 * 60 * 15 // convert minutes to ms

export class BalanceStore {
  @observable
  public currentBalance: number = 0

  @observable
  public lifetimeBalance: number = 0

  @observable
  private earningHistory: Map<number, number> = new Map()

  @computed
  public get earningWindows(): EarningWindow[] {
    const windows: EarningWindow[] = []

    for (let [time, earning] of this.earningHistory) {
      windows.push({
        timestamp: new Date(time),
        earnings: earning,
      })
    }

    return windows.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  }
  /** Total earnings for the last 24 hours */
  @computed
  public get lastDayEarnings(): number {
    return this.getTotalEarnings(1)
  }

  /** Total earnings for the last 7 days */
  @computed
  public get lastWeekEarnings(): number {
    return this.getTotalEarnings(7)
  }

  /** Total earnings for the last 30 days */
  @computed
  public get lastMonthEarnings(): number {
    return this.getTotalEarnings(30)
  }

  private getTotalEarnings = (numberOfDays: number): number => {
    let totalEarnings = 0
    const now = Date.now()

    for (let [time, earning] of this.earningHistory) {
      //Delta time (days)
      const deltaTime = (now - time) / (24 * 60 * 60 * 1000)

      if (deltaTime <= numberOfDays) {
        totalEarnings += earning
      }
    }

    return totalEarnings
  }

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {
    autorun(() => {
      this.store?.analytics?.trackLifetimeBalance?.(this.lifetimeBalance)
    })

    //TODO: Test only
    for (let i = 0; i < 96; i++) {
      this.addEarningEvent(Math.random(), new Date(Date.now() - bucketSize * i))
    }
  }

  @action.bound
  refreshBalance = flow(function* (this: BalanceStore) {
    try {
      const response = yield this.axios.get('profile/balance')

      //Generates a fake earning history in the client
      this.addFakeEarningHistory(this.currentBalance, response.data.currentBalance)

      this.currentBalance = response.data.currentBalance
      this.lifetimeBalance = response.data.lifetimeBalance
    } catch (error) {
      console.error('Balance error: ')
      console.error(error)
    }
  })

  @action
  private addFakeEarningHistory = (currentBalance: number, newBalance: number) => {
    //Skip the initial data load
    if (currentBalance === 0) return

    const deltaBalance = newBalance - currentBalance

    if (deltaBalance < 0) return

    this.addEarningEvent(deltaBalance, new Date(Date.now()))
  }

  @action
  private addEarningEvent = (deltaBalance: number, timestamp: Date) => {
    const roundedDate = Math.round(timestamp.getTime() / bucketSize) * bucketSize

    const currentEarning = this.earningHistory.get(roundedDate)

    this.earningHistory.set(roundedDate, (currentEarning || 0) + deltaBalance)
  }
}
