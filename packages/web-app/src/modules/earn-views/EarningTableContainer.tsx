import type { RootStore } from '../../Store'
import { connect } from '../../connect'
import { EarningTable } from './components/EarningTable'

const mapStoreToProps = (store: RootStore): any => {
  return {
    earningsPerMachine: store.balance.earningsPerMachine,
    machines: store.balance.machines,
    daysShowing: store.balance.getDaysShowingEarnings,
    fetchEarningsPerMachine: store.balance.fetchEarningsPerMachine,
  }
}

export const EarningTableContainer = connect(mapStoreToProps, EarningTable)
