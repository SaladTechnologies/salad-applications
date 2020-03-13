import { connect } from '../../connect'
import { Titlebar, MenuItem } from './components/Titlebar'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore): any => {
  const menuItems: MenuItem[] = [
    new MenuItem('Account Settings', store.ui.showProfilePage, !store.version.onLatestDesktop),
    new MenuItem('Referrals', store.ui.showReferralsPage),
    new MenuItem('Reward Vault', store.ui.showRewardVaultPage),
    new MenuItem('Offerwall', store.ui.showOfferwallPage),
  ]
  return {
    showWindowActions: store.native.isNative,
    onMinimize: store.native.minimizeWindow,
    onMaximize: store.native.maximizeWindow,
    onClose: store.native.closeWindow,
    onWhatsNew: store.ui.showWhatNewPage,
    bottomBorder: true,
    menuItems: menuItems,
    showWhatsNew: store.profile.showWhatsNew,
  }
}

export const MainTitlebarContainer = connect(mapStoreToProps, Titlebar)
