import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { SettingsModalPage } from './components/SettingsModalPage'

const mapStoreToProps = (store: RootStore): any => ({
  onCloseClicked: () => store.ui.hideModal(),
  onSendBug: store.ui.openNewBug,
  onSendLog: store.native.sendLog,
  showSendLog: store.native.canSendLogs,
})

export const SettingsModalContainer = connect(mapStoreToProps, SettingsModalPage)
