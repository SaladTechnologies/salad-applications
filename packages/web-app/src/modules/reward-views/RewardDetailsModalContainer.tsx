import { connect } from '../../connect'
import { RewardDetailsModal } from './components/RewardDetailsModal'
import { RootStore } from '../../Store'
import { RouteComponentProps } from 'react-router-dom'

const mapStoreToProps = (store: RootStore, props: RouteComponentProps<{ id: string }>) => ({
  reward: store.rewards.getReward(props.match.params.id),
  onClickClose: store.ui.hideModal,
  onRedeem: store.rewards.redeemReward,
  onSelect: store.rewards.selectTargetReward,
})

export const RewardDetailsModalContainer = connect(
  mapStoreToProps,
  RewardDetailsModal,
)
