import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import type { EarningsSummaryPageProps } from './pages/EarningsSummaryPage'
import { EarningsSummaryPage } from './pages/EarningsSummaryPage'

const mapStoreToProps = (store: RootStore): Omit<EarningsSummaryPageProps, 'classes'> => ({
  currentBalance: store.balance.currentBalance,
  daysShowing: store.balance.getDaysShowingEarnings,
  lifetimeBalance: store.balance.lifetimeBalance,
  lifetimeXP: store.xp.currentXp,
  viewLast24HR: store.balance.viewLast24Hours,
  viewLast7Days: store.balance.viewLast7Days,
  viewLast30Days: store.balance.viewLast30Days,
  earningHistory: store.balance.earningsHistory,
})

export const EarningsSummaryPageContainer = connect(mapStoreToProps, EarningsSummaryPage)
