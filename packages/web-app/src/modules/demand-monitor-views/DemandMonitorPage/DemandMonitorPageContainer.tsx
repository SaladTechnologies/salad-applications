import type { FC } from 'react'
import { connect } from '../../../connect'
import { FeatureFlags, useFeatureManager } from '../../../FeatureManager'
import type { RootStore } from '../../../Store'
import { DemandMonitorPage, type Props as DemandMonitorPageProps } from './DemandMonitorPage'

interface Props extends DemandMonitorPageProps {
  isAuthenticated: boolean
}

export const _DemandMonitorPageContainer: FC<Props> = ({ isAuthenticated, ...props }: Props) => {
  const featureManager = useFeatureManager()
  const isDemandNotificationsFeatureFlagEnabled = featureManager.isEnabled(FeatureFlags.DemandNotifications)
  const withGetNotifiedButton = isDemandNotificationsFeatureFlagEnabled && !isAuthenticated

  return <DemandMonitorPage {...props} withGetNotifiedButton={withGetNotifiedButton} />
}

const mapStoreToProps = (store: RootStore): any => ({
  onLoginClick: store.auth.login,
  fetchDemandedHardwarePerformanceList: store.demandMonitor.fetchDemandedHardwarePerformanceList,
  isAuthenticated: store.auth.isAuthenticated,
  demandedHardwarePerformanceList: store.demandMonitor.demandedHardwarePerformanceList,
})

export const DemandMonitorPageContainer = connect(mapStoreToProps, _DemandMonitorPageContainer)
