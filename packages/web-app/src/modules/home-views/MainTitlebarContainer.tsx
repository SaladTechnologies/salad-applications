import { connect } from '../../connect'
import { Titlebar, MenuItem } from './components/Titlebar'
import { RootStore } from '../../Store'
import { Config } from '../../config'

const mapStoreToProps = (store: RootStore): any => {
  const menuItems: MenuItem[] = [
    new MenuItem('Account', store.ui.showProfilePage, true),
    new MenuItem(
      'Referrals',
      store.ui.showReferralsPage,
      store.profile.currentProfile && store.profile.currentProfile.viewedReferralOnboarding,
    ),
    new MenuItem('Settings', store.ui.showSettingsPage, true),
  ]
  return {
    showWindowActions: store.native.isNative,
    onMinimize: store.native.minimizeWindow,
    onMaximize: store.native.maximizeWindow,
    onClose: store.native.closeWindow,
    onWhatsNew: store.ui.showWhatNewPage,
    bottomBorder: true,
    menuItems: menuItems,
    showWhatsNew:
      store.profile.currentProfile &&
      store.profile.currentProfile.lastSeenApplicationVersion !== Config.whatsNewVersion,
  }
}

export const MainTitlebarContainer = connect(mapStoreToProps, Titlebar)
