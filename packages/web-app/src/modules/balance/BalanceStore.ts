import { action, observable, autorun } from 'mobx'
import { DataResource } from '../data-refresh/models'
import { RootStore } from '../../Store'
import { Config } from '../../config'
import { convertHours } from '../../utils'

export class BalanceStore {
  private estimateTimer?: NodeJS.Timeout

  private lastUpdateTime: number = Date.now()

  @observable
  public currentBalance: number = 0

  @observable
  public lifetimeBalance: number = 0

  @observable
  public currentEarningRate: number = 0

  constructor(store: RootStore) {
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

  @action
  loadDataRefresh = (data: DataResource) => {
    this.currentBalance = data.currentBalance
    this.currentEarningRate = data.earningVelocity
    this.lifetimeBalance = data.lifetimeBalance
    this.lastUpdateTime = Date.now()
  }

  @action
  updateEstimate = () => {
    let curTime = Date.now()

    let dt = curTime - this.lastUpdateTime

    let dBal = dt * (this.currentEarningRate / convertHours(1))

    this.currentBalance += dBal

    this.lastUpdateTime = curTime
  }
}
