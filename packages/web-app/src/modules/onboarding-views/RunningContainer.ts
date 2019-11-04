import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { Running } from './components/Running/Running'

const mapStoreToProps = (store: RootStore) => ({
  earningRatePerDay: store.profile.earningRatePerDay,
  rewardsOverTime: store.profile.rewardsOverTime,
})

export const RunningContainer = connect(
  mapStoreToProps,
  Running,
)
