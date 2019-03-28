import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { OfflineModal } from './components/OfflineModal'

const mapStoreToProps = (store: RootStore) => ({
  isOnline: store.native.isOnline,
})

export const OfflineModalContainer = connect(
  mapStoreToProps,
  OfflineModal,
)
