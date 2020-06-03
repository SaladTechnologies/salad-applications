import { SettingsPage } from '../../components'
import { connect } from '../../connect'
import { ReferralSettingsContainer } from '../account-views/referral-views'
import { AdGateContainer } from './AdGateContainer'
import { AdGemContainer } from './AdGemContainer'
import { EarningSummaryContainer } from './EarningSummaryContainer'
import { MiningContainer } from './MiningContainer'
import { MiningInformationContainer } from './MiningInformationContainer'
import { OfferToroContainer } from './OfferToroContainer'
import { OfferwallContainer } from './OfferwallContainer'

const mapStoreToProps = (): any => {
  return {
    pageTitle: 'Earn',
    menuItems: [
      { text: 'Summary', url: '/earn/summary', component: EarningSummaryContainer },
      { text: 'Mining', url: '/earn/mine', component: MiningContainer, divider: true },
      { text: 'How It Works', url: '/earn/mine/how-it-works', component: MiningInformationContainer, inset: true },
      { text: 'Offerwalls', url: '/earn/offerwall', component: OfferwallContainer, divider: true },
      {
        text: 'AdGate',
        url: '/earn/adgate',
        component: AdGateContainer,
        inset: true,
      },
      { text: 'AdGem', url: '/earn/adgem', component: AdGemContainer, inset: true },
      {
        text: 'OfferToro',
        url: '/earn/offer-toro',
        component: OfferToroContainer,
        inset: true,
      },

      { text: 'Referrals', url: '/earn/referrals', component: ReferralSettingsContainer, divider: true },
    ],
  }
}

export const EarnMenuContainer = connect(mapStoreToProps, SettingsPage)
