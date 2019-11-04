import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { RedemptionCompleteModal } from './components/RedemptionCompleteModal'

const mapStoreToProps = (store: RootStore): any => ({
  onCloseClicked: store.ui.hideModal,
})

export const RedemptionCompleteModalContainer = connect(
  mapStoreToProps,
  RedemptionCompleteModal,
)
