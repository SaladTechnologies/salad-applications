import type { RootStore } from '../../Store'
import { connect } from '../../connect'
import { EarningLineChart } from './components/EarningLineChart'

const mapStoreToProps = (store: RootStore): any => {
  return {
    earningsPerMachine: store.balance.earningsPerMachine,
    daysShowing: store.balance.getDaysShowingEarnings,
    getMultipleMachinesEarnings: store.balance.getMultipleMachinesEarnings,
  }
}

export const EarningLineChartContainer = connect(mapStoreToProps, EarningLineChart)
