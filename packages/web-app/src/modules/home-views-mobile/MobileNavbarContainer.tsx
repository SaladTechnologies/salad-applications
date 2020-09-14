import { faQuestionCircle, faUser } from '@fortawesome/free-regular-svg-icons'
import { faDollarSign, faListUl } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { MobileNavbar, MobileNavItem } from './components/MobileNavbar'

const size = '3x'

const menuItems: MobileNavItem[] = [
  new MobileNavItem('Earnings', <FontAwesomeIcon size={size} icon={faDollarSign} />, '/earn/summary'),
  new MobileNavItem('Offerwalls', <FontAwesomeIcon size={size} icon={faListUl} />, '/earn/offerwall'),
  new MobileNavItem('Account', <FontAwesomeIcon size={size} icon={faUser} />, '/account/summary'),
  new MobileNavItem('Support', <FontAwesomeIcon size={size} icon={faQuestionCircle} />, undefined, () => {
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
