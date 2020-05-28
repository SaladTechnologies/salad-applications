import { config } from '../../config'
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
    }, config.dataRefreshRate)

    this.rewardsTimer = setInterval(() => {
      this.store.rewards.refreshRewards()
    }, config.rewardRefreshRate)

    //Do the initial data pull
    this.refreshData()
    this.store.rewards.refreshRewards()

    if (this.store.auth.isAuthenticated) {
      this.store.vault.loadVault()
    }
  }

  refreshData = () => {
    if (!this.store.auth.isAuthenticated) {
      return
    }

    try {
      this.store.balance.refreshBalanceAndHistory()
      this.store.rewards.loadSelectedReward()
      this.store.referral.loadReferrals()
      this.store.home.loadBannerInfo()
      this.store.vault.loadVault()
      this.store.xp.refreshXp()
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
