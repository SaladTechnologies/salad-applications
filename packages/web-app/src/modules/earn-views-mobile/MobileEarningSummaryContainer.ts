import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { EarningSummary } from './components/EarningSummary'

const mapStoreToProps = (store: RootStore): any => ({
  currentBalance: store.balance.currentBalance,
  lifetimeBalance: store.balance.lifetimeBalance,
  totalXp: store.xp.currentXp,
  last24Hr: store.balance.lastDayEarnings,
  last7Day: store.balance.lastWeekEarnings,
  last30Day: store.balance.lastMonthEarnings,
  earningHistory: store.balance.lastDayEarningWindows,
})

export const MobileEarningSummaryContainer = connect(mapStoreToProps, EarningSummary)
