import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { EarningSummaryPage } from './pages/EarningSummaryPage'
import { getNumberWithCommas } from './utils'

const mapStoreToProps = (store: RootStore): any => {
  const trackAndNavigateToRewardVaultPage = () => {
    store.analytics.trackEarnPageVaultButtonClicked()
    store.routing.push(`/store/vault`)
  }

  return {
    currentBalance: store.balance.currentBalance,
    lifetimeBalance: store.balance.lifetimeBalance,
    totalChoppingHours: store.xp.currentXp && getNumberWithCommas((store.xp.currentXp / 60).toFixed(0)),
    isLatestCompletedRedeemedRewardsLoading: store.vault.isLatestCompletedRedeemedRewardsLoading,
    startRedemptionsRefresh: store.vault.startRefresh,
    stopRedemptionsRefresh: store.vault.stopRefresh,
    redeemedRewards: store.vault.redemptions,
    latestCompletedRedeemedRewards: store.vault.latestCompletedRedeemedRewards,
    last24HrEarnings: store.balance.lastDayEarnings,
    last7DayEarnings: store.balance.lastWeekEarnings,
    last30DayEarnings: store.balance.lastMonthEarnings,
    earningHistory: store.balance.earningsHistory,
    bonusEarningRate: store.bonuses.currentEarningBonus,
    trackEarnPageFAQLinkClicked: store.analytics.trackEarnPageFAQLinkClicked,
    trackEarnPageViewed: store.analytics.trackEarnPageViewed,
    trackAndNavigateToRewardVaultPage,
    viewLast24Hours: store.balance.viewLast24Hours,
    viewLast7Days: store.balance.viewLast7Days,
    viewLast30Days: store.balance.viewLast30Days,
  }
}

export const EarningSummaryContainer = connect(mapStoreToProps, EarningSummaryPage)
