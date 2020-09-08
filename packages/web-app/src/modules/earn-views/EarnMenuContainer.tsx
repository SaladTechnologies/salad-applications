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
      { text: 'Mining', url: '/earn/mine', component: MiningInformationContainer, divider: true },
      { text: 'Miner Details', url: '/earn/mine/miner-details', component: MiningContainer, inset: true },
      { text: 'Offerwalls', url: '/earn/offerwall', component: OfferwallContainer, divider: true },
      {
        text: 'AdGate',
        url: '/earn/offerwall/adgate',
        component: AdGateContainer,
        inset: true,
      },
      { text: 'AdGem', url: '/earn/offerwall/adgem', component: AdGemContainer, inset: true },
      {
        text: 'OfferToro',
        url: '/earn/offerwall/offer-toro',
        component: OfferToroContainer,
        inset: true,
      },
      { text: 'Referrals', url: '/earn/referrals', component: ReferralSettingsContainer, divider: true },
    ],
  }
}

export const EarnMenuContainer = connect(mapStoreToProps, SettingsPage)
