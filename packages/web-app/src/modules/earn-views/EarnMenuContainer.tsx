import { connect } from '../../connect'
import { SettingsPage } from '../../components'
import { OfferwallContainer } from './OfferwallContainer'
import { MiningContainer } from './MiningContainer'
import { AdGemContainer } from './AdGemContainer'
import { OfferToroContainer } from './OfferToroContainer'
import { AdGateContainer } from './AdGateContainer'
import { ReferralSettingsContainer } from '../account-views/referral-views'
import { EarningSummaryContainer } from './EarningSummaryContainer'
import { MiningInformationContainer } from './MiningInformationContainer'

const mapStoreToProps = (): any => {
  return {
    pageTitle: 'Earn',
    menuItems: [
      { text: 'Summary', url: '/earn/summary', component: EarningSummaryContainer },
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
      { text: 'Mining', url: '/earn/mine', component: MiningContainer, divider: true },
      { text: 'How It Works', url: '/earn/mine/how-it-works', component: MiningInformationContainer, inset: true },
      { text: 'Referrals', url: '/earn/referrals', component: ReferralSettingsContainer, divider: true },
    ],
  }
}

export const EarnMenuContainer = connect(mapStoreToProps, SettingsPage)
