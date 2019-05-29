import { connect } from '../../connect'
import { SelectedReward } from './components/SelectedReward'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore) => ({
  reward: store.rewards.selectedReward,
  onRewardClick: store.rewards.viewReward,
})

export const SelectedRewardContainer = connect(
  mapStoreToProps,
  SelectedReward,
)
