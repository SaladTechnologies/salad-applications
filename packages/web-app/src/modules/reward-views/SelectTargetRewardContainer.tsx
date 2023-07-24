import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { SelectTargetRewardPage } from './pages'

const mapStoreToProps = (store: RootStore): any => {
  const navigateToStorePage = () => store.routing.push(`/store`)
  return {
    recommendedRewards: store.rewards.recommendedRewards,
    targetReward: store.rewards.selectedTargetReward,
    onConfirmTargetReward: store.rewards.setSelectedTargetReward,
    onSelectDifferentReward: store.rewards.removeSelectedTargetReward,
    fetchRecommendedRewards: store.rewards.fetchRecommendedRewards,
    navigateToStorePage,
  }
}

export const SelectTargetRewardContainer = connect(mapStoreToProps, SelectTargetRewardPage)
