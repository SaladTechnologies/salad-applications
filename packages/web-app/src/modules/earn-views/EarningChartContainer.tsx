import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { EarningChart } from './components/EarningChart'

const mapStoreToProps = (store: RootStore): any => ({
  earningHistory: store.balance.earningsHistory,
  viewLast24Hours: store.balance.viewLast24Hours,
  viewLast7Days: store.balance.viewLast7Days,
  viewLast30Days: store.balance.viewLast30Days,
  daysShowing: store.balance.getDaysShowingEarnings,
})

export const EarningChartContainer = connect(mapStoreToProps, EarningChart)
