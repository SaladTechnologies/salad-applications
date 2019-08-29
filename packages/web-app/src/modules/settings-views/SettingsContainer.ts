import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { Settings } from './components'
import { Config } from '../../config'

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
    { url: '/settings/referrals', text: 'Referrals' },
    { url: '/settings/windows-settings', text: 'Windows Settings' },
  ]

  return {
    onCloseClicked: () => store.ui.hideModal(),
    onCloseKeyPress: () => store.ui.hideModal(),
    onListItemClick: (url: string) => handleSettingsMenuClick(store, url),
    onSendBug: handleBug,
    menuItems: menuItems,
    appVersion: 'Alpha', //TODO: 0.3.0 get the version of the electron app
    appBuild: Config.appBuild,
  }
}

export const SettingsContainer = connect(
  mapStoreToProps,
  Settings,
)
