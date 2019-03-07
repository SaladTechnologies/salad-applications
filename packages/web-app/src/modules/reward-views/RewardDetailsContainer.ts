import { connect, MapStoreToProps } from '../../connect'
import { RewardDetails } from './components/RewardDetails'

const mapStoreToProps: MapStoreToProps = store => ({
  reward: store.rewards.currentRewardDetails,
  onClickClose: store.rewards.hideDetailModal,
  onRedeem: store.rewards.redeemReward,
  onSelect: store.rewards.selectReward,
})

export const RewardDetailsContainer = connect(
  mapStoreToProps,
  RewardDetails,
)
