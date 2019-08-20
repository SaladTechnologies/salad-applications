import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { SettingsModalPage } from './components/SettingsModalPage'

const handleBug = () => {
  openLink('https://salad.zendesk.com/hc/en-us/requests/new')
}

const openLink = (url: string) => {
  window.open(url, '_blank')
}

const mapStoreToProps = (store: RootStore) => ({
  onCloseClicked: () => store.ui.hideModal(),
  onSendBug: handleBug,
  onSendLog: store.native.sendLog,
  showSendLog: store.native.canSendLogs,
})

export const SettingsModalContainer = connect(
  mapStoreToProps,
  SettingsModalPage,
)
