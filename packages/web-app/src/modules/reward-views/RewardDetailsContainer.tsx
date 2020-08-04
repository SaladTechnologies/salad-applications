import { RouteComponentProps } from 'react-router-dom'
import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { RewardDetailsPage } from './pages'

const mapStoreToProps = (store: RootStore, props: RouteComponentProps<{ id: string }>): any => ({
  loadReward: store.rewards.loadReward,
  rewardId: props.match.params.id,
  reward: store.rewards.getReward(props.match.params.id),
  onBack: store.routing.goBack,
  onRedeem: store.rewards.redeemReward,
  isInCart: store.rewards.isInChoppingCart(props.match.params.id),
  onAddToCart: store.rewards.addToChoppingCart,
  onRemoveFromCart: store.rewards.removeFromChoppingCart,
})

export const RewardDetailsContainer = connect(mapStoreToProps, RewardDetailsPage)
