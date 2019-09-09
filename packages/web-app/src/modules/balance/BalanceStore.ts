import { action, observable, flow, autorun } from 'mobx'
import { RootStore } from '../../Store'
import { AxiosInstance } from 'axios'
import { Config } from '../../config'

export class BalanceStore {
  private estimateTimer?: NodeJS.Timeout

  private interpolRate: number = 0

  @observable
  public currentBalance: number = 0

  @observable
  public actualBalance: number = 0

  @observable
  public lifetimeBalance: number = 0

  private lastUpdateTime: number = Date.now()

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
  refreshBalance = flow(function*(this: BalanceStore) {
    try {
      let balance = yield this.axios.get('profile/balance')
      const delta = balance.data.currentBalance - this.currentBalance
      const maxDelta = Config.maxBalanceDelta

      console.log('>> [[BalanceStore] refreshBalance] delta: ', delta)
      console.log('>> [[BalanceStore] refreshBalance] maxDelta: ', maxDelta)
      console.log('>> [[BalanceStore] refreshBalance] balance.data.currentBalance: ', balance.data.currentBalance)

      if (delta > maxDelta || delta < 0) {
        this.interpolRate = 0
        this.currentBalance = balance.data.currentBalance
        console.log('>>>>>> [[BalanceStore] refreshBalance] this.currentBalance: ', this.currentBalance)
      } else {
        this.interpolRate = delta / Config.dataRefreshRate
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
