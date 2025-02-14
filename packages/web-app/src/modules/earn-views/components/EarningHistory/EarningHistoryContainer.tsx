import { connect } from '../../../../connect'
import type { RootStore } from '../../../../Store'
import { EarningHistory } from './EarningHistory'

const mapStoreToProps = (store: RootStore): any => ({
  trackEarningHistoryFilterClicked: store.analytics.trackEarningHistoryFilterClicked,
  viewLast24Hours: store.balance.viewLast24Hours,
  viewLast30Days: store.balance.viewLast30Days,
  viewLast7Days: store.balance.viewLast7Days,
})

export const EarningHistoryContainer = connect(mapStoreToProps, EarningHistory)
