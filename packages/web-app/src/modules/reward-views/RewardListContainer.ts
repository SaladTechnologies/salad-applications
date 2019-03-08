import { connect, MapStoreToProps } from '../../connect'
import { RewardList } from './components/RewardList'

const mapStoreToProps: MapStoreToProps = store => ({
  rewards: store.rewards.filteredRewards,
  onRewardClick: store.rewards.selectCurrentReward,
})

export const RewardListContainer = connect(
  mapStoreToProps,
  RewardList,
)
