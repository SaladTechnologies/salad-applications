import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { Settings } from './components'

const handleBug = () => {
  openLink('https://salad.zendesk.com/hc/en-us/requests/new')
}

const openLink = (url: string) => {
  window.open(url, '_blank')
}

const handleSettingsMenuClick = (store: RootStore, url: string) => {
  store.routing.push(url)
}

const mapStoreToProps = (store: RootStore) => ({
  onCloseClicked: () => store.ui.hideModal(),
  onListItemClick: (url: string) => handleSettingsMenuClick(store, url),
  onSendBug: handleBug,
})

export const SettingsContainer = connect(
  mapStoreToProps,
  Settings,
)
