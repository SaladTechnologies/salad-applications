import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { useVaultRefresh } from '../../rewards/vault.ts'
import { getStore } from '../../Store'
import { EarningSummaryPage } from './pages/EarningSummaryPage'
import { getNumberWithCommas } from './utils'

const mapStoreToProps = (store: RootStore): any => {
  const trackAndNavigateToRewardVaultPage = () => {
    store.analytics.trackEarnPageVaultButtonClicked()
    store.routing.push(`/store/vault`)
  }

  return {
    currentBalance: store.balance.currentBalance,
    earningsPerMachine: store.balance.earningsPerMachine,
    lifetimeBalance: store.balance.lifetimeBalance,
    totalChoppingHours: store.xp.currentXp && getNumberWithCommas((store.xp.currentXp / 60).toFixed(0)),
    isLatestCompletedRedeemedRewardsLoading: store.vault.isLatestCompletedRedeemedRewardsLoading,
    redeemedRewards: store.vault.redemptions,
    latestCompletedRedeemedRewards: store.vault.latestCompletedRedeemedRewards,
    last24HrEarnings: store.balance.lastDayEarnings,
    last7DayEarnings: store.balance.lastWeekEarnings,
    last30DayEarnings: store.balance.lastMonthEarnings,
    bonusEarningRate: store.bonuses.currentEarningBonus,
    machines: store.balance.machines,
    currentHourlyEarningRatesPerMachine: store.balance.currentHourlyEarningRatesPerMachine,
    trackEarnPageFAQLinkClicked: store.analytics.trackEarnPageFAQLinkClicked,
    trackEarnPageViewed: store.analytics.trackEarnPageViewed,
    trackAndNavigateToRewardVaultPage,
    viewLast24Hours: store.balance.viewLast24Hours,
    viewLast7Days: store.balance.viewLast7Days,
    viewLast30Days: store.balance.viewLast30Days,
    fetchCurrentEarningRatesPerMachine: store.balance.fetchCurrentEarningRatesPerMachine,
    fetchEarningsPerMachine: store.balance.fetchEarningsPerMachine,
  }
}

const ConnectedEarningSummary = connect(mapStoreToProps, EarningSummaryPage)

/** The earnings summary page, whose redeemed rewards and balance refresh while it is open. */
export const EarningSummaryContainer = () => {
  useVaultRefresh(getStore().vault.refresh)
  return <ConnectedEarningSummary />
}
