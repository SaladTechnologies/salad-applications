import { connect, MapStoreToProps } from '../../connect'
import { SelectedReward } from './components/SelectedReward'

const mapStoreToProps: MapStoreToProps = store => ({
  reward: store.rewards.selectedReward,
})

export const SelectedRewardContainer = connect(
  mapStoreToProps,
  SelectedReward,
)
