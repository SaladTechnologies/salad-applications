import { config } from '../../config'
import { RootStore } from '../../Store'

export class RefreshService {
  constructor(private store: RootStore) {}

  start() {
    console.log('Starting refresh service')

    //Start a timer to poll for data
    setInterval(() => {
      this.refreshData()
    }, config.dataRefreshRate)

    setInterval(() => {
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
    // Load unauthenticated data
    try {
      this.store.home.loadBannerInfo()
    } catch (error) {
      console.error(error)
    }

    if (!this.store.auth.isAuthenticated) {
      return
    }

    // Load authenticated data
    try {
      this.store.balance.refreshBalanceAndHistory()
      this.store.rewards.loadSelectedReward()
      this.store.referral.loadReferrals()
      this.store.vault.loadVault()
      this.store.xp.refreshXp()
    } catch (error) {
      console.error(error)
    }
  }
}
