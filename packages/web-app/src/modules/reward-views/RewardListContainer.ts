import { connect, MapStoreToProps } from '../../connect'
import { RewardList } from './components/RewardList'

const mapStoreToProps: MapStoreToProps = store => ({
  rewards: store.rewards.filteredRewards,
})

export const RewardListContainer = connect(
  mapStoreToProps,
  RewardList,
)
