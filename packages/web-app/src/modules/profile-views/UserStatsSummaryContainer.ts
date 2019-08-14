import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { UserStatsSummary } from './components/UserStatsSummary'

const mapStoreToProps = (store: RootStore) => ({
  lifetimeEarning: store.balance.lifetimeBalance,
  machineCount: store.machine.machineCount,
})

export const UserStatsSummaryContainer = connect(
  mapStoreToProps,
  UserStatsSummary,
)
