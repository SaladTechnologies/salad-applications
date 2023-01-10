import { MenuButton, MenuItem, SettingsPage } from '../../components'
import { config } from '../../config'
import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { AccountContainer } from '../account-views/account-views'
import { ReferralSettingsContainer } from '../account-views/referral-views'
import { BonusPageContainer } from '../bonus-views'
import { DesktopSettingsContainer } from './desktop-settings-views'

const mapStoreToProps = (store: RootStore): any => {
  const menuItems: MenuItem[] = [
    { url: '/account/summary', text: 'Account', component: AccountContainer },
    { url: '/account/referrals', text: 'Referrals', component: ReferralSettingsContainer },
    { url: '/account/bonuses', text: 'Bonuses', component: BonusPageContainer },
  ]

  const nativeMenuItems: MenuItem[] = [
    { url: '/account/summary', text: 'Account', component: AccountContainer },
    { url: '/account/referrals', text: 'Referrals', component: ReferralSettingsContainer },
    { url: '/account/bonuses', text: 'Bonuses', component: BonusPageContainer },
    {
      url: '/account/desktop-settings',
      text: 'Desktop App Settings',
      component: DesktopSettingsContainer,
      divider: true,
      desktopOnly: true,
    },
  ]

  const handleLogout = () => {
    store.analytics.trackButtonClicked('logout_button', 'Log Out', 'enabled')
    store.auth.logout()
  }

  const handleClose = () => {
    store.analytics.trackSmartLink('/store', 'Back')
    store.ui.hideModal()
  }

  const buttons: MenuButton[] = [{ text: 'Log out', onClick: handleLogout }]

  return {
    onClose: () => handleClose(),
    menuItems: store.native.isNative ? nativeMenuItems : menuItems,
    appVersion: store.native.desktopVersion,
    appBuild: config.appBuild,
    latestDesktop: store.version.onLatestDesktop,
    onDownloadLatestDesktop: store.version.downloadLatestDesktop,
    menuButtons: store.auth.isAuthenticated ? buttons : [],
  }
}

export const SettingsContainer = connect(mapStoreToProps, SettingsPage)
