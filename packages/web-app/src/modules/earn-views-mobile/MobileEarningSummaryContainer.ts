import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { withLogin } from '../auth-views'
import { MobileEarningSummary } from './components/MobileEarningSummary'

const mapStoreToProps = (store: RootStore): any => ({
  currentBalance: store.balance.currentBalance,
  lifetimeBalance: store.balance.lifetimeBalance,
  totalXp: store.xp.currentXp,
  last24Hr: store.balance.lastDayEarnings,
  last7Day: store.balance.lastWeekEarnings,
  last30Day: store.balance.lastMonthEarnings,
  earningHistory: store.balance.lastDayEarningWindows,
})

export const MobileEarningSummaryContainer = connect(mapStoreToProps, withLogin(MobileEarningSummary))
