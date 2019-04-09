import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { CudaErrorPage } from './components/ErrorPage'

const mapStoreToProps = (store: RootStore) => ({
  onCloseClicked: () => store.ui.hideModal(),
})

export const CudaErrorContainer = connect(
  mapStoreToProps,
  CudaErrorPage,
)
