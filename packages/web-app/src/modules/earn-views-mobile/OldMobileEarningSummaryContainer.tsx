import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { withLogin } from '../auth-views'
import { OldMobileEarningSummary } from './components/OldMobileEarningSummary'

const mapStoreToProps = (store: RootStore): any => ({
  currentBalance: store.balance.currentBalance,
  lifetimeBalance: store.balance.lifetimeBalance,
  totalXp: store.xp.currentXp,
  last24HrEarnings: store.balance.lastDayEarnings,
  last7DayEarnings: store.balance.lastWeekEarnings,
  last30DayEarnings: store.balance.lastMonthEarnings,
  earningHistory: store.balance.earningsHistory,
  viewLast24Hours: store.balance.viewLast24Hours,
  viewLast7Days: store.balance.viewLast7Days,
  viewLast30Days: store.balance.viewLast30Days,
})

export const OldMobileEarningSummaryContainer = connect(mapStoreToProps, withLogin(OldMobileEarningSummary))
 