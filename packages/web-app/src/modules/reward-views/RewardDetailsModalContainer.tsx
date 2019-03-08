import { connect, MapStoreToProps } from '../../connect'
import { RewardDetails } from './components/RewardDetails'

const mapStoreToProps: MapStoreToProps = store => ({
  reward: store.rewards.currentRewardDetails,
  onClickClose: store.rewards.clearCurrentReward,
  onRedeem: store.rewards.redeemReward,
  onSelect: store.rewards.selectTargetReward,
})

export const RewardDetailsModalContainer = connect(
  mapStoreToProps,
  RewardDetails,
)
