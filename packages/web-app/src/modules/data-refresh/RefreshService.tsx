import type { RootStore } from '../../Store'

export class RefreshService {
  constructor(private store: RootStore) {}

  /**
   * Reloads the banner, and the signed-in user's balance, target reward, referrals, vault, XP, avatars and bonuses. The
   * root route runs it when the app opens and every `config.dataRefreshRate` (`useAppRefresh`); sign-in and a claimed
   * bonus run it too.
   */
  refreshData = () => {
    // Load unauthenticated data
    try {
      this.store.loadBanner()
    } catch (error) {
      console.error(error)
    }

    if (!this.store.auth.isAuthenticated()) {
      return
    }

    // Load authenticated data
    try {
      this.store.balance.refreshBalanceAndHistory()
      this.store.rewards.fetchSelectedTargetReward()
      this.store.referrals.loadReport()
      this.store.vault.loadVault()
      this.store.xp.load()
      this.store.profile.loadAvatars()
      this.store.profile.loadSelectedAvatar()
      this.store.bonuses.load()
    } catch (error) {
      console.error(error)
    }
  }
}
