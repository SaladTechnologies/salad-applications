import { faQuestionCircle, faUser } from '@fortawesome/free-regular-svg-icons'
import { faHome, faListUl } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { connect } from '../../connect'
import { MobileNavbar, MobileNavItem } from './components/MobileNavbar'

const size = '3x'

const menuItems: MobileNavItem[] = [
  new MobileNavItem('Earnings', <FontAwesomeIcon size={size} icon={faHome} />, '/earn/summary'),
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

const mapStoreToProps = (): any => ({
  navItems: menuItems,
})

export const MobileNavbarContainer = connect(mapStoreToProps, MobileNavbar)
