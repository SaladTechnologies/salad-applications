import { Config } from '../../config'
import { RootStore } from '../../Store'

export class RefreshService {
  private dataTimer?: NodeJS.Timeout
  private rewardsTimer?: NodeJS.Timeout

  constructor(private store: RootStore) {}

  start() {
    console.log('Starting refresh service')

    //Start a timer to poll for data
    this.dataTimer = setInterval(() => {
      this.refreshData()
    }, Config.dataRefreshRate)

    this.rewardsTimer = setInterval(() => {
      this.store.rewards.refreshRewards()
    }, Config.rewardsRefreshRate)
    
    //Do the initial data pull
    this.refreshData()
    this.store.rewards.refreshRewards()
  }

  refreshData =() =>{
    if (!this.store.auth.isAuthenticated()) {
      return
    }
    try {
      /*
        TODO:
          - this.rewards.loadDataRefresh
          - this.referral.loadDataRefresh
          - this.machine.loadDataRefresh
      */ 
      this.store.xp.refreshXp()
      this.store.balance.loadDataRefresh()
    } catch (error) {
      console.error(error)
    }
  }
  stop() {
    console.log('Stopping refresh service')

    if (this.dataTimer) clearInterval(this.dataTimer)
    if (this.rewardsTimer) clearInterval(this.rewardsTimer)
  }
}

