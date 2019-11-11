import { connect } from '../../connect'
import { RewardList } from './components/RewardList'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore): any => ({
  rewards: store.rewards.filteredRewards,
  isLoading: store.rewards.isLoading,
  onRewardClick: store.rewards.viewReward,
})

export const RewardListContainer = connect(
  mapStoreToProps,
  RewardList,
)
