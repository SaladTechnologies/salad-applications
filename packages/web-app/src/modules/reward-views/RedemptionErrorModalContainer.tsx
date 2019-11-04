import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { RedemptionErrorModal } from './components/RedemptionErrorModal'

const mapStoreToProps = (store: RootStore): any => ({
  onCloseClicked: store.ui.hideModal,
})

export const RedemptionErrorModalContainer = connect(
  mapStoreToProps,
  RedemptionErrorModal,
)
