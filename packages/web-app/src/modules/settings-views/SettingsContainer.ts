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

const mapStoreToProps = (store: RootStore) => {
  type LinkList = { url: string; text: string }
  const menuItems: LinkList[] = [
    { url: '/settings/windows-settings', text: 'Windows Settings' },
    { url: '/settings/referrals', text: 'Referrals' },
  ]

  return {
    onCloseClicked: () => store.ui.hideModal(),
    onCloseKeyPress: () => store.ui.hideModal(),
    onListItemClick: (url: string) => handleSettingsMenuClick(store, url),
    onSendBug: handleBug,
    menuItems: menuItems,
  }
}

export const SettingsContainer = connect(
  mapStoreToProps,
  Settings,
)
