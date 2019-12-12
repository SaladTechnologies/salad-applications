import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { NoPluginErrorPage } from './components/NoPluginErrorPage'

const mapStoreToProps = (store: RootStore): any => {

  return {
    onCloseClicked: () => store.ui.hideModal(),
    onSendLog: store.native.sendLog,
    showSendLog: store.native.canSendLogs
  }
}

export const NoPluginErrorContainer = connect(
  mapStoreToProps,
  NoPluginErrorPage,
)
