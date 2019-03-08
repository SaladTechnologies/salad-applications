import { connect } from '../../connect'
import { RewardList } from './components/RewardList'
import { Reward } from '../reward/models'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore) => ({
  rewards: store.rewards.filteredRewards,
  onRewardClick: (r: Reward) => store.ui.showModal(`/rewards/${r.id}`),
})

export const RewardListContainer = connect(
  mapStoreToProps,
  RewardList,
)
