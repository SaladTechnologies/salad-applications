import { connect } from '../../connect'
import { MenuBar, MenuItem } from './components/MenuBar'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore) => {
  const menuItems: MenuItem[] = [
    new MenuItem('Account', () => store.routing.push('/profile')),
    new MenuItem('Settings', () => store.routing.push('/settings')),
  ]
  return {
    menuItems: menuItems,
  }
}

export const MenuBarContainer = connect(
  mapStoreToProps,
  MenuBar,
)
