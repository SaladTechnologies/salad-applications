import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { EarningHistory } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  last24Hr: store.balance.lastDayEarnings,
  last7Day: store.balance.lastWeekEarnings,
  last30Day: store.balance.lastMonthEarnings,
  earningHistory: store.balance.earningsHistory,
})

export const EarningHistoryContainer = connect(mapStoreToProps, EarningHistory)
