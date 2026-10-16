import type { FC } from 'react'
import { connect } from '../../../connect'
import type { RootStore } from '../../../Store'
import { DemandMonitorPage, type Props as DemandMonitorPageProps } from './DemandMonitorPage'

export const _DemandMonitorPageContainer: FC<DemandMonitorPageProps> = ({ isAuthenticated, ...props }) => {
  return <DemandMonitorPage {...props} isAuthenticated={isAuthenticated} withGetNotifiedButton />
}

const mapStoreToProps = (store: RootStore): any => ({
  onLoginClick: () => {
    store.analytics.trackButtonClicked('login_button', 'Log In Button', 'enabled')
    store.auth.login('/account/alerts')
  },
  fetchDemandedHardwarePerformanceList: store.demandMonitor.fetchDemandedHardwarePerformanceList,
  navigateToDemandAlerts: () => store.routing.push('/account/alerts'),
  isAuthenticated: store.auth.isAuthenticated,
  demandedHardwarePerformanceList: store.demandMonitor.demandedHardwarePerformanceList,
})

export const DemandMonitorPageContainer = connect(mapStoreToProps, _DemandMonitorPageContainer)
