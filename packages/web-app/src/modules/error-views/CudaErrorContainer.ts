import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { CudaErrorPage } from './components/CudaErrorPage'

const mapStoreToProps = (store: RootStore): any => ({
  onCloseClicked: () => store.ui.hideModal(true),
})

export const CudaErrorContainer = connect(mapStoreToProps, CudaErrorPage)
