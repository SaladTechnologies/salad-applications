import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { EarningsSummaryPage, EarningsSummaryPageProps } from './pages/EarningsSummaryPage'

const mapStoreToProps = (store: RootStore): Omit<EarningsSummaryPageProps, 'classes'> => ({
  currentBalance: store.balance.currentBalance,
  daysShowing: store.balance.getDaysShowingEarnings,
  isNative: store.native.isNative,
  lifetimeBalance: store.balance.lifetimeBalance,
  lifetimeXP: store.xp.currentXp,
  viewLast24HR: store.balance.viewLast24Hours,
  viewLast7Days: store.balance.viewLast7Days,
  viewLast30Days: store.balance.viewLast30Days,
  earningHistory: store.balance.earningsHistory,
  hardwareDetected: [],
})

export const EarningsSummaryPageContainer = connect(mapStoreToProps, EarningsSummaryPage)
