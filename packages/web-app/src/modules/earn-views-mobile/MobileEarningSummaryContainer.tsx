import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { withLogin } from '../auth-views'
import { MobileEarningSummary } from './components/MobileEarningSummary'

const mapStoreToProps = (store: RootStore): any => ({
  daysShowing: store.balance.getDaysShowingEarnings,
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

export const MobileEarningSummaryContainer = connect(mapStoreToProps, withLogin(MobileEarningSummary))
