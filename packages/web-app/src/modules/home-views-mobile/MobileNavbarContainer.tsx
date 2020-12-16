import { connect } from '../../connect'
import { RootStore } from '../../Store'
import accountIcon from './assets/account-icon.svg'
import earnIcon from './assets/earn-icon.svg'
import offerwallIcon from './assets/offerwall-icon.svg'
import supportIcon from './assets/support-icon.svg'
import { MobileNavbar, MobileNavItem } from './components/MobileNavbar'

const menuItems: MobileNavItem[] = [
  new MobileNavItem('Offerwalls', offerwallIcon, '/earn/offerwall'),
  new MobileNavItem('Earnings', earnIcon, '/earn/summary'),
  new MobileNavItem('Account', accountIcon, '/settings/summary'),
  new MobileNavItem('Support', supportIcon, undefined, () => {
    //@ts-ignore
    if (zE) {
      //@ts-ignore
      zE('webWidget', 'open')
    }
  }),
]

const mapStoreToProps = (store: RootStore): any => ({
  path: store.routing.location, //Used to trigger the component to render with the current location
  navItems: menuItems,
})

export const MobileNavbarContainer = connect(mapStoreToProps, MobileNavbar)
