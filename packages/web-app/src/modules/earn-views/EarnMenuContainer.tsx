import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { SettingsPage } from '../../components'
import { OfferwallContainer } from './OfferwallContainer'
import { MiningContainer } from './MiningContainer'
import { AdGemContainer } from './AdGemContainer'
import { OfferToroContainer } from './OfferToroContainer'
import { AdGateContainer } from './AdGateContainer'
import { ReferralSettingsContainer } from '../account-views/referral-views'

const mapStoreToProps = (store: RootStore): any => {
  return {
    onCloseClicked: () => store.ui.hideModal(),
    onCloseKeyPress: () => store.ui.hideModal(),
    menuItems: [
      { text: 'Offerwalls', url: '/earn/offerwall', component: OfferwallContainer },
      { text: 'AdGate', url: '/earn/adgate', component: AdGateContainer, enabled: store.offerwall.offerwall },
      { text: 'AdGem', url: '/earn/adgem', component: AdGemContainer, enabled: store.offerwall.offerwall },
      { text: 'OfferToro', url: '/earn/offer-toro', component: OfferToroContainer, enabled: store.offerwall.offerwall },
      { text: 'Mining', url: '/earn/mine', component: MiningContainer, divider: true },
      { text: 'Referrals', url: '/earn/referrals', component: ReferralSettingsContainer, divider: true },
    ],
  }
}

export const EarnMenuContainer = connect(mapStoreToProps, SettingsPage)
