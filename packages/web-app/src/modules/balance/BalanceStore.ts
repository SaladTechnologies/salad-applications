import { action, observable, flow } from 'mobx'
import { AxiosInstance } from 'axios'
import { BalanceEvent } from './models'
import moment from 'moment'

export class BalanceStore {
  @observable
  public currentBalance: number = 0

  @observable
  public lifetimeBalance: number = 0

  @observable
  public balanceEvents: BalanceEvent[] = []

  private balanceEventId: number = 0

  constructor(private readonly axios: AxiosInstance) {}

  @action.bound
  refreshBalance = flow(function*(this: BalanceStore) {
    try {
      let balance = yield this.axios.get('profile/balance')
      const deltaBalance = balance.data.currentBalance - this.currentBalance

      if (deltaBalance > 0 && this.currentBalance !== 0) {
        const balanceEvent: BalanceEvent = {
          id: this.balanceEventId++,
          deltaBalance: deltaBalance,
          timestamp: moment.utc(),
        }

        //Adds the event
        this.balanceEvents.unshift(balanceEvent)
      }

      //Limits the number of events
      while (this.balanceEvents.length > 20) {
        this.balanceEvents.pop()
      }

      this.currentBalance = balance.data.currentBalance
      this.lifetimeBalance = balance.data.lifetimeBalance
    } catch (error) {
      console.error('Balance error: ' + error)
    }
  })
}
