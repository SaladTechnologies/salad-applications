import { useExternalState } from '../../app/external-state.ts'
import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { getStore } from '../../Store'
import type { RewardState } from '../reward'
import { selectedTargetRewardOf } from '../reward'
import { SelectTargetRewardPage } from './pages'

const mapStoreToProps = (store: RootStore, props: { rewards: RewardState }): any => {
  const navigateToStorePage = () => store.routing.push(`/store`)
  return {
    recommendedRewards: props.rewards.recommendedRewards,
    targetReward: selectedTargetRewardOf(props.rewards),
    onConfirmTargetReward: store.rewards.setSelectedTargetReward,
    onSelectDifferentReward: store.rewards.removeSelectedTargetReward,
    fetchRecommendedRewards: store.rewards.fetchRecommendedRewards,
    navigateToStorePage,
  }
}

const ConnectedSelectTargetRewardPage = connect(mapStoreToProps, SelectTargetRewardPage)

/** The page for choosing a target reward. It reads the recommended and target rewards and passes them down. */
export const SelectTargetRewardContainer = () => (
  <ConnectedSelectTargetRewardPage rewards={useExternalState(getStore().rewards.state)} />
)
