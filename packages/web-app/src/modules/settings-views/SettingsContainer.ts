import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { SettingsPage, MenuItem } from '../../components'
import { Config } from '../../config'
import { ReferralSettingsContainer } from './referral-views'
import { VaultListContainer } from '../vault-views'
import { WindowsSettingsContainer } from './windows-settings-views'
import { AccountContainer } from './account-views'

const mapStoreToProps = (store: RootStore): any => {
  const menuItems: MenuItem[] = [
    { url: '/settings/account', text: 'Account', component: AccountContainer },
    { url: '/settings/referrals', text: 'Referrals', component: ReferralSettingsContainer },
    { url: '/settings/reward-vault', text: 'Reward Vault', component: VaultListContainer },
    { url: '/settings/windows-settings', text: 'Settings', component: WindowsSettingsContainer },
  ]

  return {
    onCloseClicked: () => store.ui.hideModal(),
    onCloseKeyPress: () => store.ui.hideModal(),
    onListItemClick: (url: string) => store.routing.push(url),
    onSendBug: store.ui.openNewBug,
    menuItems: menuItems,
    appVersion: store.native.desktopVersion,
    appBuild: Config.appBuild,
    onSendLog: store.native.sendLog,
    latestDesktop: store.version.onLatestDesktop,
    onDownloadLatestDesktop: store.version.downloadLatestDesktop,
  }
}

export const SettingsContainer = connect(mapStoreToProps, SettingsPage)
