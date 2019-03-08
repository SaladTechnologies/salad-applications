import { connect, MapStoreToProps } from '../../connect'
import { MenuBar, MenuItem } from './components/MenuBar'

const mapStoreToProps: MapStoreToProps = store => {
  //TODO
  const menuItems: MenuItem[] = [] // [new MenuItem('Account', () => store.ui.showModal(<AccountModalContainer />))]
  return {
    menuItems: menuItems,
  }
}

export const MenuBarContainer = connect(
  mapStoreToProps,
  MenuBar,
)
