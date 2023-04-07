import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { SelectTargetRewardPage } from './pages'

const mapStoreToProps = (store: RootStore): any => ({
  recommendedRewards: store.rewards.recommendedRewards,
  targetReward: store.rewards.selectedTargetReward,
  onConfirmTargetReward: store.rewards.setSelectedTargetReward,
  onSelectDifferentReward: store.rewards.removeSelectedTargetReward,
  getRecommendedRewards: store.rewards.getRecommendedRewards,
})

export const SelectTargetRewardContainer = connect(mapStoreToProps, SelectTargetRewardPage)
