import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { FallbackErrorPage } from './components/FallbackErrorPage'

const mapStoreToProps = (store: RootStore): any => ({
  onCloseClicked: () => store.ui.hideModal(),
  onSendLog: store.native.sendLog,
  showSendLog: store.native.canSendLogs,
})

export const FallbackErrorContainer = connect(
  mapStoreToProps,
  FallbackErrorPage,
)
