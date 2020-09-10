import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { UnknownErrorPage } from './components/UnknownErrorPage'

const mapStoreToProps = (store: RootStore): any => ({
  onCloseClicked: () => store.ui.hideModal(),
})

export const UnknownErrorContainer = connect(mapStoreToProps, UnknownErrorPage)
