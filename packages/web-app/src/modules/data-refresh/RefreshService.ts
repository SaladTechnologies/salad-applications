import { Config } from '../../config'
import { RootStore } from '../../Store'

export class RefreshService {
  private dataTimer?: NodeJS.Timeout
  private xpTimer?: NodeJS.Timeout
  private rewardsTimer?: NodeJS.Timeout

  constructor(private store: RootStore) {}

  start() {
    console.log('Starting refresh service')

    //Start a timer to poll for data
    this.dataTimer = setInterval(() => {
      this.refreshData()
    }, Config.dataRefreshRate)

    this.xpTimer = setInterval(() => {
      this.store.xp.refreshXp()
    }, Config.xpRefreshRate)

    this.rewardsTimer = setInterval(() => {
      this.store.rewards.refreshRewards()
    }, Config.rewardsRefreshRate)

    //Do the initial data pull
    this.refreshData()
    this.store.rewards.refreshRewards()
    this.store.xp.refreshXp()
  }

  refreshData = () => {
    if (!this.store.auth.isAuthenticated()) {
      return
    }
    try {
      this.store.balance.refreshBalance()
      this.store.rewards.loadSelectedReward()
      this.store.referral.loadReferrals()
      this.store.home.loadBannerInfo()
    } catch (error) {
      console.error(error)
    }
  }

  stop() {
    console.log('Stopping refresh service')

    if (this.dataTimer) clearInterval(this.dataTimer)
    if (this.rewardsTimer) clearInterval(this.rewardsTimer)
    if (this.xpTimer) clearInterval(this.xpTimer)
  }
}
