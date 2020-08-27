import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { MenuItem, Titlebar } from './components/Titlebar'

const menuItems: MenuItem[] = [
  new MenuItem('Store', '/'),
  new MenuItem('Earn', '/earn/summary'),
  new MenuItem('Help', 'https://www.salad.io/support'),
]

const mapStoreToProps = (store: RootStore): any => {
  return {
    isDesktop: store.native.isNative,
    onMinimize: store.native.minimizeWindow,
    onMaximize: store.native.maximizeWindow,
    onClose: store.native.closeWindow,
    bottomBorder: true,
    menuItems: menuItems,
    onStart: store.saladBowl.toggleRunning,
    status: store.saladBowl.status,
    startEnabled: !store.auth.isAuthenticated || store.saladBowl.canRun,
  }
}

export const MainTitlebarContainer = connect(mapStoreToProps, Titlebar)
