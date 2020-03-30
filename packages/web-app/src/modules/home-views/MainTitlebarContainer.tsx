import { connect } from '../../connect'
import { Titlebar, MenuItem } from './components/Titlebar'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore): any => {
  const menuItems: MenuItem[] = [
    new MenuItem('Store', '/'),
    new MenuItem('Referrals', '/settings/referrals'),
    new MenuItem('Reward Vault', '/settings/reward-vault'),
    new MenuItem('Settings', '/settings/windows-settings', !store.version.onLatestDesktop),
    new MenuItem('Earn', '/earn/mine'),
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
