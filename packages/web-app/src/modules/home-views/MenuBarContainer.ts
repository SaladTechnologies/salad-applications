import { connect } from '../../connect'
import { MenuBar, MenuItem } from './components/MenuBar'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore) => {
  const menuItems: MenuItem[] = [
    new MenuItem('Account', () => store.ui.showModal('/profile')),
    new MenuItem('Settings', () => store.ui.showModal('/settings')),
  ]
  return {
    menuItems: menuItems,
  }
}

export const MenuBarContainer = connect(
  mapStoreToProps,
  MenuBar,
)
