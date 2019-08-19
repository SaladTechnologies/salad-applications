import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { AntiVirusErrorPage } from './components/ErrorPage'

const mapStoreToProps = (store: RootStore) => ({
  onCloseClicked: () => store.ui.hideModal(),
})

export const AntiVirusErrorContainer = connect(
  mapStoreToProps,
  AntiVirusErrorPage,
)
