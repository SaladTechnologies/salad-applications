import { connect, MapStoreToProps } from '../../connect'
import { ModalPage } from '../../components'

const mapStoreToProps: MapStoreToProps = store => ({
  // content: store.ui.modalContent,
  // visible: store.ui.modalContent !== undefined,
  // onCloseClicked: store.ui.hideModal,
})

export const ModalContainer = connect(
  mapStoreToProps,
  ModalPage,
)
