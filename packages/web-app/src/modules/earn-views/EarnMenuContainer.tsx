import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { SettingsPage } from '../../components'
import { OfferwallContainer } from './OfferwallContainer'
import { MiningContainer } from './MiningContainer'
import { AdGemContainer } from './AdGemContainer'
import { OfferToroContainer } from './OfferToroContainer'
import { AdGateContainer } from './AdGateContainer'
import { ReferralSettingsContainer } from '../account-views/referral-views'
import { EarningSummaryContainer } from './EarningSummaryContainer'

const mapStoreToProps = (store: RootStore): any => {
  return {
    menuItems: [
      { text: 'Summary', url: '/earn/summary', component: EarningSummaryContainer },
      { text: 'Offerwalls', url: '/earn/offerwall', component: OfferwallContainer, divider: true },
      {
        text: 'AdGate',
        url: '/earn/adgate',
        component: AdGateContainer,
        enabled: store.offerwall.offerwall,
        inset: true,
      },
      { text: 'AdGem', url: '/earn/adgem', component: AdGemContainer, enabled: store.offerwall.offerwall, inset: true },
      {
        text: 'OfferToro',
        url: '/earn/offer-toro',
        component: OfferToroContainer,
        enabled: store.offerwall.offerwall,
        inset: true,
      },
      { text: 'Mining', url: '/earn/mine', component: MiningContainer, divider: true },
      { text: 'Referrals', url: '/earn/referrals', component: ReferralSettingsContainer, divider: true },
    ],
  }
}

export const EarnMenuContainer = connect(mapStoreToProps, SettingsPage)
