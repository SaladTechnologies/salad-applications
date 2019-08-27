import { action, observable, flow, autorun } from 'mobx'
import { RootStore } from '../../Store'
import { AxiosInstance } from 'axios'
import { Config } from '../../config'

export class BalanceStore {
  private estimateTimer?: NodeJS.Timeout

  private interpolRate : number = 0
  
  @observable
  public currentBalance: number = 0

  @observable
  public lifetimeBalance: number = 0

  private lastUpdateTime: number = Date.now()

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
  refreshBalance = flow(function*(this: BalanceStore) {
    try {
      let balance = yield this.axios.get('profile/balance')
      const delta = balance.data.currentBalance - this.currentBalance
      const maxDelta = Config.maxBalanceDelta
      if( delta > maxDelta || delta < 0 ){
        this.currentBalance = balance.data.currentBalance
      }else{
      this.interpolRate = delta/Config.dataRefreshRate
      }
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

    if(dBal){
      //TODO:: YOU NEED TO make sure the dbal doesn't exceed the current balance
    }
    this.currentBalance = this.currentBalance + dBal

    this.lastUpdateTime = curTime
  }
}

