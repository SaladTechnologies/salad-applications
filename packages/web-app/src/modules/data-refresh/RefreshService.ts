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
      this.store.refreshData()
    }, Config.dataRefreshRate)

    this.rewardsTimer = setInterval(() => {
      this.store.rewards.refreshRewards()
    }, Config.rewardsRefreshRate)

    //Do the initial data pull
    this.store.refreshData()
    this.store.rewards.refreshRewards()
  }
  stop() {
    console.log('Stopping refresh service')

    if (this.dataTimer) clearInterval(this.dataTimer)
    if (this.rewardsTimer) clearInterval(this.rewardsTimer)
  }
}
