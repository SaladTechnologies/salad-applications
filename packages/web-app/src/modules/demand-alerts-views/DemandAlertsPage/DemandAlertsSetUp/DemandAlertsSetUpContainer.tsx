import { connect } from '../../../../connect'
import type { RootStore } from '../../../../Store'
import { DemandAlertsSetUp } from './DemandAlertsSetUp'

const mapStoreToProps = (store: RootStore): any => ({
  demandedHardwarePerformanceList: store.demandMonitor.demandedHardwarePerformanceList,
  fetchDemandedHardwarePerformanceList: store.demandMonitor.fetchDemandedHardwarePerformanceList,
  setSubscribeToDemandAlertStatus: store.demandAlerts.setSubscribeToDemandAlertStatus,
  subscribeToDemandAlert: store.demandAlerts.subscribeToDemandAlert,
  subscribeToDemandAlertStatus: store.demandAlerts.subscribeToDemandAlertStatus,
})

export const DemandAlertsSetUpContainer = connect(mapStoreToProps, DemandAlertsSetUp)
