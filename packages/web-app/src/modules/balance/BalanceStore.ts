import { action, observable, flow } from 'mobx'
import { RootStore } from '../../Store'
import { AxiosInstance } from 'axios'

export class BalanceStore {
  @observable
  public currentBalance: number = 0

  @observable
  public lifetimeBalance: number = 0

  constructor(store: RootStore, private readonly axios: AxiosInstance) {}

  @action.bound
  refreshBalance = flow(function*(this: BalanceStore) {
    try {
      let balance = yield this.axios.get('profile/balance')

      this.currentBalance = balance.data.currentBalance
      this.lifetimeBalance = balance.data.lifetimeBalance
    } catch (error) {
      console.error('Balance error: ')
      console.error(error)
    }
  })
}
