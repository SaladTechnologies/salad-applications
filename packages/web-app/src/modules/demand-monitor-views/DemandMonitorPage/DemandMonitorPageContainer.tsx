import type { FC } from 'react'
import { connect } from '../../../connect'
import { useHttp } from '../../../data/http-context.ts'
import { isSignedIn, useSession } from '../../../data/session.ts'
import type { DemandedHardwarePerformance } from '../../../earnings/demand-monitor.ts'
import { useDemandMonitorGpus } from '../../../earnings/demand-monitor.ts'
import { useNavigation } from '../../../routing/navigation-context.ts'
import type { RootStore } from '../../../Store'
import { DemandMonitorPage, type Props as DemandMonitorPageProps } from './DemandMonitorPage'

const _DemandMonitorPageContainer: FC<DemandMonitorPageProps> = ({ isAuthenticated, ...props }) => {
  return <DemandMonitorPage {...props} isAuthenticated={isAuthenticated} withGetNotifiedButton />
}

interface OwnProps {
  onNavigateToDemandAlerts: () => void
  demandedHardwarePerformanceList: DemandedHardwarePerformance[] | undefined
  /** Whether the user is signed in: `undefined` until it is known. */
  isAuthenticated: boolean | undefined
}

const mapStoreToProps = (store: RootStore, props: OwnProps): any => ({
  onLoginClick: () => {
    store.analytics.trackButtonClicked('login_button', 'Log In Button', 'enabled')
    store.auth.login('/account/alerts')
  },
  navigateToDemandAlerts: props.onNavigateToDemandAlerts,
  isAuthenticated: props.isAuthenticated,
  demandedHardwarePerformanceList: props.demandedHardwarePerformanceList,
})

const ConnectedDemandMonitorPage = connect(mapStoreToProps, _DemandMonitorPageContainer)

/** The demand monitor page. It loads the GPUs and their demand when it opens and every hour while it is open. */
export const DemandMonitorPageContainer = () => {
  const navigation = useNavigation()
  const demandedHardwarePerformanceList = useDemandMonitorGpus(useHttp())
  return (
    <ConnectedDemandMonitorPage
      demandedHardwarePerformanceList={demandedHardwarePerformanceList}
      onNavigateToDemandAlerts={() => navigation.push('/account/alerts')}
      isAuthenticated={isSignedIn(useSession())}
    />
  )
}
