import type { RootStore } from '../../Store'
import { connect } from '../../connect'
import type { ViewData } from './components'
import { EarningLineChart } from './components/EarningLineChart'

interface EarningLineChartContainerProps {
  isAggregateView: boolean
  setViewData: (viewData: ViewData) => void
}

const mapStoreToProps = (store: RootStore, props: EarningLineChartContainerProps): any => {
  return {
    earningsPerMachine: store.balance.earningsPerMachine,
    machines: store.balance.machines,
    daysShowing: store.balance.getDaysShowingEarnings,
    fetchEarningsPerMachine: store.balance.fetchEarningsPerMachine,
    ...props,
  }
}

export const EarningLineChartContainer = connect(mapStoreToProps, EarningLineChart)
