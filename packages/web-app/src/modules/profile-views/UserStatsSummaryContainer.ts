import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { UserStatsSummary } from './components/UserStatsSummary'

const mapStoreToProps = (store: RootStore) => ({
  earningRate: store.machine.formattedCurrentEarningRate,
  miningStatus: store.native.miningStatus,
})

export const UserStatsSummaryContainer = connect(
  mapStoreToProps,
  UserStatsSummary,
)
