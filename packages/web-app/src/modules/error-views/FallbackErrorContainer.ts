import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { FallbackErrorPage } from './components/FallbackErrorPage'

const mapStoreToProps = (store: RootStore): any => ({
  onCloseClicked: () => store.ui.hideModal(),
})

export const FallbackErrorContainer = connect(mapStoreToProps, FallbackErrorPage)
