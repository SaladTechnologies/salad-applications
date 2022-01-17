import { SettingsPage } from '../../components'
import { connect } from '../../connect'
import { EarningSummaryContainer } from './EarningSummaryContainer'
import { MiningContainer } from './MiningContainer'
import { MiningInformationContainer } from './MiningInformationContainer'

const mapStoreToProps = (): any => {
  return {
    pageTitle: 'Earn',
    menuItems: [
      { text: 'Summary', url: '/earn/summary', component: EarningSummaryContainer },
      { text: 'Miner Details', url: '/earn/machine-settings', component: MiningContainer },
      { text: 'Mining FAQ', url: '/earn/mine', component: MiningInformationContainer, divider: true },
    ],
  }
}

export const EarnMenuContainer = connect(mapStoreToProps, SettingsPage)
