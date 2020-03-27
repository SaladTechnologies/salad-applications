import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { SettingsPage, MenuItem } from '../../components'
import { OfferwallContainer } from './OfferwallContainer'
import { MiningContainer } from './MiningContainer'

const mapStoreToProps = (store: RootStore): any => {
  const menuItems: MenuItem[] = [
    { text: 'Mining', url: '/earn/mine', component: MiningContainer },
    { text: 'Offerwall', url: '/earn/offerwall', component: OfferwallContainer },
  ]

  return {
    onCloseClicked: () => store.ui.hideModal(),
    onCloseKeyPress: () => store.ui.hideModal(),
    onListItemClick: (url: string) => store.routing.push(url),
    menuItems: menuItems,
  }
}

export const EarnMenuContainer = connect(mapStoreToProps, SettingsPage)
