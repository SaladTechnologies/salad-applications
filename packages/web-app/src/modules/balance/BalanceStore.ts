import { action, observable } from 'mobx'
import { DataResource } from '../data-refresh/models'

export class BalanceStore {
  @observable
  public currentBalance: number = 0

  @observable
  public lifetimeBalance: number = 0

  @observable
  public currentEarningRate: number = 0

  @action
  loadDataRefresh = (data: DataResource) => {
    this.currentBalance = data.currentBalance
    this.currentEarningRate = data.earningVelocity
    this.lifetimeBalance = data.lifetimeBalance
  }
}
