import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { withLogin } from '../auth-views'
import { MobileEarningSummary } from './components/MobileEarningSummary'

const mapStoreToProps = (store: RootStore): any => ({
  currentBalance: store.balance.currentBalance,
  lifetimeBalance: store.balance.lifetimeBalance,
  totalXp: store.xp.currentXp,
  last24HrEarnings: store.balance.lastDayEarnings,
  last7DayEarnings: store.balance.lastWeekEarnings,
  last30DayEarnings: store.balance.lastMonthEarnings,
  earningHistory: store.balance.earningsHistory,
  machines: store.balance.machines,
  currentHourlyEarningRatesPerMachine: store.balance.currentHourlyEarningRatesPerMachine,
  fetchCurrentEarningRatesPerMachine: store.balance.fetchCurrentEarningRatesPerMachine,
})

export const MobileEarningSummaryContainer = connect(mapStoreToProps, withLogin(MobileEarningSummary))
