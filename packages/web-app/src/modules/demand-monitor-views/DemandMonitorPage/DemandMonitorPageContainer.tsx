import type { FC } from 'react'
import { connect } from '../../../connect'
import { FeatureFlags, useFeatureManager } from '../../../FeatureManager'
import type { RootStore } from '../../../Store'
import { DemandMonitorPage } from './DemandMonitorPage'

interface Props {
  isAuthenticated: boolean
}

export const _DemandMonitorPageContainer: FC<Props> = ({ isAuthenticated }) => {
  const featureManager = useFeatureManager()
  const isDemandNotificationsFeatureFlagEnabled = featureManager.isEnabled(FeatureFlags.DemandNotifications)

  return <DemandMonitorPage withGetNotifiedButton={!isAuthenticated && isDemandNotificationsFeatureFlagEnabled} />
}

const mapStoreToProps = (store: RootStore): any => ({
  isAuthenticated: store.auth.isAuthenticated,
})

export const DemandMonitorPageContainer = connect(mapStoreToProps, _DemandMonitorPageContainer)
