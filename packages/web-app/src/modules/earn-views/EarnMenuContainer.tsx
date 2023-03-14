import { SettingsPage } from '../../components'
import { connect } from '../../connect'
import { MiningInformation } from './components/MiningInformation'
import { EarningSummaryContainer } from './EarningSummaryContainer'

const mapStoreToProps = (): any => {
  return {
    pageTitle: 'Earn',
    menuItems: [
      { text: 'Summary', url: '/earn/summary', component: EarningSummaryContainer },
      { text: 'Mining FAQ', url: '/earn/mine', component: MiningInformation, divider: true },
    ],
  }
}

export const EarnMenuContainer = connect(mapStoreToProps, SettingsPage)
