import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { MenuItem, Titlebar } from './components/Titlebar'

const mapStoreToProps = (store: RootStore): any => {
  const menuItems: MenuItem[] = [
    new MenuItem('Store', '/'),
    new MenuItem('Earn', '/earn/summary'),
    new MenuItem('Help', 'https://www.salad.io/support'),
  ]
  return {
    isDesktop: store.native.isNative,
    onMinimize: store.native.minimizeWindow,
    onMaximize: store.native.maximizeWindow,
    onClose: store.native.closeWindow,
    bottomBorder: true,
    menuItems: menuItems,
  }
}

export const MainTitlebarContainer = connect(mapStoreToProps, Titlebar)
