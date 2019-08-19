import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { UnknownErrorPage } from './components/ErrorPage'

const mapStoreToProps = (store: RootStore) => ({
  onCloseClicked: () => store.ui.hideModal(),
})

export const UnknownErrorContainer = connect(
  mapStoreToProps,
  UnknownErrorPage,
)
