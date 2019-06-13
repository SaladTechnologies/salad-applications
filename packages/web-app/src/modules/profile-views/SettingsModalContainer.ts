import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { SettingsModalPage } from './components/SettingsModalPage'

const handleBug = () => {
  openLink('https://salad.zendesk.com/hc/en-us/requests/new')
}

const openLink = (url: string) => {
  window.open(url, '_blank')
}

const handleSmartStartClick = (store: RootStore) => {
  store.routing.push('/settings/smart-start')
}

const mapStoreToProps = (store: RootStore) => ({
  onCloseClicked: () => store.ui.hideModal(),
  onSendBug: handleBug,
  onSmartStartClick: () => handleSmartStartClick(store),
})

export const SettingsModalContainer = connect(
  mapStoreToProps,
  SettingsModalPage,
)
