import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { SettingsPage } from '../../components'
import { OfferwallContainer } from './OfferwallContainer'
import { MiningContainer } from './MiningContainer'
import { AdGemContainer } from './AdGemContainer'
import { OfferToroContainer } from './OfferToroContainer'
import { AdGateContainer } from './AdGateContainer'

const mapStoreToProps = (store: RootStore): any => {
  return {
    onCloseClicked: () => store.ui.hideModal(),
    onCloseKeyPress: () => store.ui.hideModal(),
    menuItems: [
      { text: 'Mining', url: '/earn/mine', component: MiningContainer },
      { text: 'Offerwalls', url: '/earn/offerwall', component: OfferwallContainer, divider: true },
      { text: 'AdGate', url: '/earn/adgate', component: AdGateContainer, enabled: store.offerwall.offerwall },
      { text: 'AdGem', url: '/earn/adgem', component: AdGemContainer, enabled: store.offerwall.offerwall },
      { text: 'OfferToro', url: '/earn/offer-toro', component: OfferToroContainer, enabled: store.offerwall.offerwall },
    ],
  }
}

export const EarnMenuContainer = connect(mapStoreToProps, SettingsPage)
