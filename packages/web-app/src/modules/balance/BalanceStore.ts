import { action, observable, autorun, flow } from 'mobx'
// import { DataResource } from '../data-refresh/models'
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

  // @action
  // loadDataRefresh = (data: DataResource) => {
  //   this.currentBalance = data.currentBalance
  //   this.currentEarningRate = data.earningVelocity
  //   this.lifetimeBalance = data.lifetimeBalance
  //   this.lastUpdateTime = Date.now()
  // }

  @action
  loadDataRefresh = flow(function*(this: BalanceStore) {
    try {
      let balance = yield this.axios.get('balance')

      console.log('[[BalanceStore] loadDataRefresh] balance: ', balance)

      this.currentBalance = balance.currentBalance
      this.currentEarningRate = balance.earningVelocity
      this.lifetimeBalance = balance.lifetimeBalance
      this.lastUpdateTime = Date.now()
    } catch {}
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
