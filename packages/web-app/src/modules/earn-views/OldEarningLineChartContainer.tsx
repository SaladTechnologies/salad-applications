import type { RootStore } from '../../Store'
import { connect } from '../../connect'
import { OldEarningLineChart } from './components/OldEarningLineChart'

const mapStoreToProps = (store: RootStore): any => {
  return {
    earningsPerMachine: store.balance.earningsPerMachine,
    machines: store.balance.machines,
    daysShowing: store.balance.getDaysShowingEarnings,
    fetchEarningsPerMachine: store.balance.fetchEarningsPerMachine,
  }
}

export const OldEarningLineChartContainer = connect(mapStoreToProps, OldEarningLineChart)
