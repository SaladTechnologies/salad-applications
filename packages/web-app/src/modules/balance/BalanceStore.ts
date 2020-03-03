import { action, observable, flow, autorun } from 'mobx'
import { RootStore } from '../../Store'
import { AxiosInstance } from 'axios'
import { Config } from '../../config'
import { MiningStatus } from '../machine/models/MiningStatus'

export class BalanceStore {
  private estimateTimer?: NodeJS.Timeout

  private interpolRate: number = 0

  @observable
  public currentBalance: number = 0

  @observable
  public actualBalance: number = 0

  @observable
  public lifetimeBalance: number = 0

  /** What was the balance increase at the last refresh (USD) */
  @observable
  public lastDeltaBalance: number = 0

  private lastUpdateTime: number = Date.now()

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {
    autorun(() => {
      if (store.saladBowl.isRunning) {
        if (this.estimateTimer) clearInterval(this.estimateTimer)
        this.lastUpdateTime = Date.now()
        this.estimateTimer = setInterval(this.updateEstimate, Config.balanceEstimateRate)
      } else {
        if (this.estimateTimer) {
          clearInterval(this.estimateTimer)
          this.estimateTimer = undefined
        }
      }
    })

    autorun(() => {
      this.store?.analytics?.trackLifetimeBalance?.(this.lifetimeBalance)
    })
  }

  @action.bound
  refreshBalance = flow(function*(this: BalanceStore) {
    try {
      let balance = yield this.axios.get('profile/balance')
      this.lastDeltaBalance = balance.data.currentBalance - this.currentBalance
      const maxDelta = Config.maxBalanceDelta

      if (this.lastDeltaBalance > maxDelta || this.lastDeltaBalance < 0) {
        this.interpolRate = 0
        this.currentBalance = balance.data.currentBalance
      } else {
        this.interpolRate = this.lastDeltaBalance / Config.dataRefreshRate
      }

      // Clears out a check on 'Stopped' so mining status is not changed to 'Earning'
      if (this.store.saladBowl.status === MiningStatus.Stopped) {
        this.lastDeltaBalance = 0
      }

      this.actualBalance = balance.data.currentBalance
      this.lifetimeBalance = balance.data.lifetimeBalance
    } catch (error) {
      console.error('Balance error: ')
      console.error(error)
    }
  })

  @action
  updateEstimate = () => {
    let curTime = Date.now()

    let dt = curTime - this.lastUpdateTime

    let dBal = dt * this.interpolRate

    this.currentBalance = Math.min(this.actualBalance, this.currentBalance + dBal)

    this.lastUpdateTime = curTime
  }
}
