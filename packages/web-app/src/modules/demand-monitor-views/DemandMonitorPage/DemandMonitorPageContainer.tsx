import { connect } from '../../../connect'
import type { RootStore } from '../../../Store'
import { DemandMonitorPage } from './DemandMonitorPage'

const mapStoreToProps = (store: RootStore): any => {
  return {
    fetchDemandedHardwarePerformanceList: store.demandMonitor.fetchDemandedHardwarePerformanceList,
    demandedHardwarePerformanceList: store.demandMonitor.demandedHardwarePerformanceList,
  }
}

export const DemandMonitorPageContainer = connect(mapStoreToProps, DemandMonitorPage)
