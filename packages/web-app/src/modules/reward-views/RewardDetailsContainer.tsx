import type { RouteComponentProps } from 'react-router-dom'
import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import type { Reward } from '../reward/models'
import { RewardDetailsPage } from './pages'

const mapStoreToProps = (store: RootStore, props: RouteComponentProps<{ id: string }>): any => {
  const onRedeem = (reward: Reward) => {
    store.analytics.trackButtonClicked('buy_now', 'Buy Now', 'enabled')
    store.rewards.redeemReward(reward)
  }

  const trackDisabledBuyNowClick = () => {
    store.analytics.trackButtonClicked('buy_now', 'Buy Now', 'disabled')
  }

  const extensions = store.profile.currentProfile?.extensions
  const reward = store.rewards.getReward(props.match.params.id)
  const requiresMinecraftUsername =
    reward?.tags?.includes('requires-minecraft-username') && !extensions?.minecraftUsername
  const isRewardSelectedAsTarget = store.rewards.selectedTargetReward?.id === reward?.id

  return {
    loadReward: store.rewards.fetchAndTrackReward,
    authenticated: store.auth.isAuthenticated,
    rewardId: props.match.params.id,
    currentBalance: store.balance.currentBalance,
    reward: reward,
    isReviewing: store.rewards.isReviewing,
    onBack: store.routing.goBack,
    onRedeem,
    onTargetThisRewardClick: store.rewards.setSelectedTargetReward,
    onRemoveTargetRewardClick: store.rewards.removeSelectedTargetReward,
    isTargetReward: isRewardSelectedAsTarget,
    requiresMinecraftUsername: requiresMinecraftUsername,
    trackDisabledBuyNowClick,
  }
}

export const RewardDetailsContainer = connect(mapStoreToProps, RewardDetailsPage)
