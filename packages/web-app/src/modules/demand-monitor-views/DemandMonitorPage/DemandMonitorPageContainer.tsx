import type { FC } from 'react'
import { connect } from '../../../connect'
import { useDemandMonitorRefresh } from '../../../earnings/demand-monitor.ts'
import { useNavigation } from '../../../routing/navigation-context.ts'
import type { RootStore } from '../../../Store'
import { getStore } from '../../../Store'
import { DemandMonitorPage, type Props as DemandMonitorPageProps } from './DemandMonitorPage'

const _DemandMonitorPageContainer: FC<DemandMonitorPageProps> = ({ isAuthenticated, ...props }) => {
  return <DemandMonitorPage {...props} isAuthenticated={isAuthenticated} withGetNotifiedButton />
}

interface OwnProps {
  onNavigateToDemandAlerts: () => void
}

const mapStoreToProps = (store: RootStore, props: OwnProps): any => ({
  onLoginClick: () => {
    store.analytics.trackButtonClicked('login_button', 'Log In Button', 'enabled')
    store.auth.login('/account/alerts')
  },
  navigateToDemandAlerts: props.onNavigateToDemandAlerts,
  isAuthenticated: store.auth.isAuthenticated,
  demandedHardwarePerformanceList: store.demandMonitor.demandedHardwarePerformanceList,
})

const ConnectedDemandMonitorPage = connect(mapStoreToProps, _DemandMonitorPageContainer)

/**
 * The demand monitor page. It loads the GPUs and their demand when it opens and every hour while it is open. The GPUs
 * stay in the store, which the page reads.
 */
export const DemandMonitorPageContainer = () => {
  const store = getStore()
  const navigation = useNavigation()
  useDemandMonitorRefresh(store.demandMonitor.fetchDemandedHardwarePerformanceList)
  return <ConnectedDemandMonitorPage onNavigateToDemandAlerts={() => navigation.push('/account/alerts')} />
}
