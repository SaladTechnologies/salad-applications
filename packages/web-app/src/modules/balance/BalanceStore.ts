import { action, observable } from 'mobx'

export class BalanceStore {
  @observable
  public currentBalance: number = 0

  @observable
  public currentEarningRate: number = 0

  @action
  update(balance: number, earningRate: number) {
    this.currentBalance = balance
    this.currentEarningRate = earningRate
  }
}
