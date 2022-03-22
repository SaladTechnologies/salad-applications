import { RouteComponentProps } from 'react-router-dom'
import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { Reward } from '../reward/models'
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
  const hasPayPalAccount = store.profile.payPalId != null
  const reward = store.rewards.getReward(props.match.params.id)
  const requiresMinecraftUsername =
    reward?.tags?.includes('requires-minecraft-username') && !extensions?.minecraftUsername
  const requiresPayPalAccount = reward?.tags?.includes('requires-paypal-account') && !hasPayPalAccount
  return {
    loadReward: store.rewards.loadAndTrackReward,
    authenticated: store.auth.isAuthenticated,
    rewardId: props.match.params.id,
    currentBalance: store.balance.currentBalance,
    reward: reward,
    onBack: store.routing.goBack,
    onRedeem,
    isInCart: store.rewards.isInChoppingCart(props.match.params.id),
    onAddToCart: store.rewards.addToChoppingCart,
    onRemoveFromCart: store.rewards.removeFromChoppingCart,
    requiresMinecraftUsername: requiresMinecraftUsername,
    requiresPayPalAccount,
    trackDisabledBuyNowClick,
  }
}

export const RewardDetailsContainer = connect(mapStoreToProps, RewardDetailsPage)
