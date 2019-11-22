import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { RedemptionCompleteModal } from './components/RedemptionCompleteModal'

const mapStoreToProps = (store: RootStore): any => ({
  onCloseClicked: store.rewards.completeRedemption,
})

export const RedemptionCompleteModalContainer = connect(
  mapStoreToProps,
  RedemptionCompleteModal,
)
