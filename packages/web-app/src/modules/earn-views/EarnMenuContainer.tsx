import { SettingsPage } from '../../components'
import { connect } from '../../connect'
import { ReferralSettingsContainer } from '../account-views/referral-views'
import { EarningSummaryContainer } from './EarningSummaryContainer'
import { MiningContainer } from './MiningContainer'
import { MiningInformationContainer } from './MiningInformationContainer'

const mapStoreToProps = (): any => {
  return {
    pageTitle: 'Earn',
    menuItems: [
      { text: 'Summary', url: '/earn/summary', component: EarningSummaryContainer },
      { text: 'Mining', url: '/earn/mine', component: MiningInformationContainer, divider: true },
      { text: 'Miner Details', url: '/earn/mine/miner-details', component: MiningContainer, inset: true },
      { text: 'Referrals', url: '/earn/referrals', component: ReferralSettingsContainer, divider: true },
    ],
  }
}

export const EarnMenuContainer = connect(mapStoreToProps, SettingsPage)
