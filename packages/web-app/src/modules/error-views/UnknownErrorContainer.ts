import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { UnknownErrorPage } from './components/UnknownErrorPage'

const mapStoreToProps = (store: RootStore): any => ({
  onCloseClicked: () => store.ui.hideModal(),
  onSendLog: store.native.sendLog,
  showSendLog: store.native.canSendLogs,
})

export const UnknownErrorContainer = connect(mapStoreToProps, UnknownErrorPage)
