import { connect } from '../../connect'
import { RewardRedemptionModal } from './components/RewardRedemptionModal'
import { RootStore } from '../../Store'
import { RouteComponentProps } from 'react-router-dom'

const mapStoreToProps = (store: RootStore, props: RouteComponentProps<{ id: string }>): any => ({
  reward: store.rewards.getReward(props.match.params.id),
  onClickClose: store.ui.hideModal,
  onRedeem: store.rewards.redeemReward,
  submitting: store.rewards.isRedeeming,
  onClickDone: store.ui.hideModal,
})

export const RewardRedemptionModalContainer = connect(
  mapStoreToProps,
  RewardRedemptionModal,
)
