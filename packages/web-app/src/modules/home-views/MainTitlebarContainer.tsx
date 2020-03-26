import { connect } from '../../connect'
import { Titlebar, MenuItem } from './components/Titlebar'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore): any => {
  const menuItems: MenuItem[] = [
    new MenuItem('Referrals', store.ui.showReferralsPage),
    new MenuItem('Reward Vault', store.ui.showRewardVaultPage),
    new MenuItem('Settings', store.ui.showSettingsPage, !store.version.onLatestDesktop),
    new MenuItem('Offerwall', store.ui.showOfferwallPage),
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

export const MainTitlebarContainer = connect(mapStoreToProps, Titlebar)
