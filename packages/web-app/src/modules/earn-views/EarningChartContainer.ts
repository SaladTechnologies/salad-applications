import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { EarningChart } from './components/EarningChart'

const mapStoreToProps = (store: RootStore): any => ({
  earningHistory: store.balance.lastDayEarningWindows,
})

export const EarningChartContainer = connect(mapStoreToProps, EarningChart)
