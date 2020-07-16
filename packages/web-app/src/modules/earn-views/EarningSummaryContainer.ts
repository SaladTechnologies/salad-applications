import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { EarningSummaryPage } from './pages/EarningSummaryPage'

const mapStoreToProps = (store: RootStore): any => ({
  currentBalance: store.balance.currentBalance,
  lifetimeBalance: store.balance.lifetimeBalance,
  last24Hr: store.balance.lastDayEarnings,
  last7Day: store.balance.lastWeekEarnings,
  last30Day: store.balance.lastMonthEarnings,
  earningHistory: store.balance.lastDayEarningWindows,
})

export const EarningSummaryContainer = connect(mapStoreToProps, EarningSummaryPage)
