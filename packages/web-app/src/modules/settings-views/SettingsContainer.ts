import { MenuButton, MenuItem, SettingsPage } from '../../components'
import { config } from '../../config'
import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { AccountContainer } from '../account-views/account-views'
import { ReferralSettingsContainer } from '../account-views/referral-views'
import { EngagementStore } from '../engagement'
import { VaultListContainer } from '../vault-views'
import { DesktopSettingsContainer } from './desktop-settings-views'

const mapStoreToProps = (store: RootStore): any => {
  const menuItems: MenuItem[] = [
    { url: '/settings/summary', text: 'Account', component: AccountContainer },
    { url: '/settings/referrals', text: 'Referrals', component: ReferralSettingsContainer },
    { url: '/settings/reward-vault', text: 'Reward Vault', component: VaultListContainer },
    {
      url: EngagementStore.CHANGELOG_URL,
      text: "What's New",
      externalLink: true,
      divider: true,
    },
  ]

  const nativeMenuItems: MenuItem[] = [
    { url: '/settings/summary', text: 'Account', component: AccountContainer },
    { url: '/settings/referrals', text: 'Referrals', component: ReferralSettingsContainer },
    { url: '/settings/reward-vault', text: 'Reward Vault', component: VaultListContainer },
    {
      url: '/settings/desktop-settings',
      text: 'Desktop App Settings',
      component: DesktopSettingsContainer,
      divider: true,
      desktopOnly: true,
    },
    {
      url: EngagementStore.CHANGELOG_URL,
      text: "What's New",
      externalLink: true,
      divider: true,
    },
  ]

  const buttons: MenuButton[] = [{ text: 'Log out', onClick: store.auth.logout }]

  return {
    onClose: () => store.ui.hideModal(),
    menuItems: store.native.isNative ? nativeMenuItems : menuItems,
    appVersion: store.native.desktopVersion,
    appBuild: config.appBuild,
    latestDesktop: store.version.onLatestDesktop,
    onDownloadLatestDesktop: store.version.downloadLatestDesktop,
    menuButtons: store.auth.isAuthenticated ? buttons : [],
    isAuthenticated: store.auth.isAuthenticated,
  }
}

export const SettingsContainer = connect(mapStoreToProps, SettingsPage)
