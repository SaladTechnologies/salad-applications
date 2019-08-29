import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { AntiVirusErrorPage } from './components/AntiVirusErrorPage'

const mapStoreToProps = (store: RootStore) => ({
  onCloseClicked: () => store.ui.hideModal(),
  onSendLog: store.native.sendLog,
  showSendLog: store.native.canSendLogs,
})

export const AntiVirusErrorContainer = connect(
  mapStoreToProps,
  AntiVirusErrorPage,
)
