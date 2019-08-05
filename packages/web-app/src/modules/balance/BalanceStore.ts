import { action, observable, autorun, flow } from 'mobx'
import { RootStore } from '../../Store'
import { Config } from '../../config'
import { convertHours } from '../../utils'
import { AxiosInstance } from 'axios'

export class BalanceStore {
  private estimateTimer?: NodeJS.Timeout

  private lastUpdateTime: number = Date.now()

  @observable
  public currentBalance: number = 0

  @observable
  public lifetimeBalance: number = 0

  @observable
  public currentEarningRate: number = 0

  constructor(store: RootStore, private readonly axios: AxiosInstance) {
    autorun(() => {
      if (store.native.isRunning) {
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
  }

  @action.bound
  loadDataRefresh = flow(function*(this: BalanceStore) {
    try {
      let balance = yield this.axios.get('profile/balance')

      this.currentBalance = balance.data.currentBalance
      this.currentEarningRate = balance.data.earningVelocity
      this.lifetimeBalance = balance.data.lifetimeBalance
      this.lastUpdateTime = Date.now()
    } catch(error) {
      console.error('Balance error: ')
      console.error(error)
    }
  })

  @action
  updateEstimate = () => {
    let curTime = Date.now()
    let dt = curTime - this.lastUpdateTime
    let dBal = dt * (this.currentEarningRate / convertHours(1))

    this.currentBalance += dBal
    this.lastUpdateTime = curTime
  }
}
