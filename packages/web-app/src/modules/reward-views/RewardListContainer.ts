import { connect, MapStoreToProps } from '../../connect'
import { RewardList } from './components/RewardList'

const mapStoreToProps: MapStoreToProps = store => ({
  rewards: store.rewards.currentRewards,
})

export const RewardListContainer = connect(
  mapStoreToProps,
  RewardList,
)
