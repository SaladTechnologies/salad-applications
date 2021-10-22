import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { Modal } from './components/Modal'

const mapStoreToProps = (store: RootStore): any => ({
  backgroundColor: store.modalUIStore.modalContent?.backgroundColor,
  hideModal: store.modalUIStore.hideModal,
  ModalContentComponent: store.modalUIStore.modalContent?.content,
  showModal: store.modalUIStore.show,
  onClose: store.modalUIStore.modalContent?.onClose,
  title: store.modalUIStore.modalContent?.title,
})

export const ModalContainer = connect(mapStoreToProps, Modal)
