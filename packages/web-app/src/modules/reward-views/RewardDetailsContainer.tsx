import { RouteComponentProps } from 'react-router-dom'
import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { RewardDetailsPage } from './pages'

const mapStoreToProps = (store: RootStore, props: RouteComponentProps<{ id: string }>): any => {
  const extensions = store.profile.currentProfile?.extensions
  const reward = store.rewards.getReward(props.match.params.id)
  const requiresMinecraftUsername =
    reward?.tags?.includes('requires-minecraft-username') && !extensions?.minecraftUsername

  return {
    loadReward: store.rewards.loadAndTrackReward,
    rewardViewed: store.analytics.trackRewardView,
    authenticated: store.auth.isAuthenticated,
    rewardId: props.match.params.id,
    currentBalance: store.balance.currentBalance,
    reward: reward,
    onBack: store.routing.goBack,
    onRedeem: store.rewards.redeemReward,
    isInCart: store.rewards.isInChoppingCart(props.match.params.id),
    onAddToCart: store.rewards.addToChoppingCart,
    onRemoveFromCart: store.rewards.removeFromChoppingCart,
    requiresMinecraftUsername: requiresMinecraftUsername,
  }
}

export const RewardDetailsContainer = connect(mapStoreToProps, RewardDetailsPage)
