import { connect } from '../../connect'
import { Titlebar, MenuItem } from './components/Titlebar'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore): any => {
  const menuItems: MenuItem[] = [
    new MenuItem('Account', store.ui.showProfilePage, true),
    new MenuItem('Referrals', store.ui.showReferralsPage, store.profile.currentProfile && store.profile.currentProfile.viewedReferralOnboarding),
    new MenuItem('Settings', store.ui.showSettingsPage, true),
  ]
  return {
    showWindowActions: store.native.isNative,
    onMinimize: store.native.minimizeWindow,
    onMaximize: store.native.maximizeWindow,
    onClose: store.native.closeWindow,
    bottomBorder: true,
    menuItems: menuItems,
  }
}

export const MainTitlebarContainer = connect(
  mapStoreToProps,
  Titlebar,
)
