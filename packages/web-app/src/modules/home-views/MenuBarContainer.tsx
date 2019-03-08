import { connect, MapStoreToProps } from '../../connect'
import { MenuBar, MenuItem } from './components/MenuBar'

const mapStoreToProps: MapStoreToProps = store => {
  const menuItems: MenuItem[] = [new MenuItem('Account', store.profile.showAccountModal)]
  return {
    menuItems: menuItems,
  }
}

export const MenuBarContainer = connect(
  mapStoreToProps,
  MenuBar,
)
