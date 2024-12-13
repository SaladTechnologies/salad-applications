import { connect } from '../../../../connect'
import type { RootStore } from '../../../../Store'
import { DemandAlertsSetUp } from './DemandAlertsSetUp'

const mapStoreToProps = (store: RootStore): any => ({
  createNewSubscription: store.demandAlerts.createNewSubscription,
  createNewSubscriptionStatus: store.demandAlerts.createNewSubscriptionStatus,
  demandedHardwarePerformanceList: store.demandMonitor.demandedHardwarePerformanceList,
  fetchDemandedHardwarePerformanceList: store.demandMonitor.fetchDemandedHardwarePerformanceList,
  setCreateNewSubscriptionStatus: store.demandAlerts.setCreateNewSubscriptionStatus,
})

export const DemandAlertsSetUpContainer = connect(mapStoreToProps, DemandAlertsSetUp)
