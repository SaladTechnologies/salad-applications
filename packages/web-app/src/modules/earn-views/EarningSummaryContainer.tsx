import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { EarningSummaryPage } from './pages/EarningSummaryPage'
import { getNumberWithCommas } from './utils'

const mapStoreToProps = (store: RootStore): any => ({
  currentBalance: store.balance.currentBalance,
  lifetimeBalance: store.balance.lifetimeBalance,
  totalChoppingHours: store.xp.currentXp && getNumberWithCommas((store.xp.currentXp / 60).toFixed(0)),
  startRedemptionsRefresh: store.vault.startRefresh,
  stopRedemptionsRefresh: store.vault.stopRefresh,
  redeemedRewardsCount: store.vault.redemptions.length,
  last24Hr: store.balance.lastDayEarnings,
  last7Day: store.balance.lastWeekEarnings,
  last30Day: store.balance.lastMonthEarnings,
  earningHistory: store.balance.earningsHistory,
  bonusEarningRate: store.bonuses.currentEarningBonus,
})

export const EarningSummaryContainer = connect(mapStoreToProps, EarningSummaryPage)
