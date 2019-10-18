import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { UserStatsSummary } from './components/UserStatsSummary'

const mapStoreToProps = (store: RootStore) => ({
  earningRate: store.machine.currentEarningRate,
  miningStatus: store.saladBowl.status,
})

export const UserStatsSummaryContainer = connect(
  mapStoreToProps,
  UserStatsSummary,
)
