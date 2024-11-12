import { connect } from '../../../../connect'
import type { RootStore } from '../../../../Store'
import { DemandMonitorTable } from './DemandMonitorTable'

const mapStoreToProps = (store: RootStore): any => {
  return {
    fetchDemandedHardwarePerformanceList: store.demandMonitor.fetchDemandedHardwarePerformanceList,
    demandedHardwarePerformanceList: store.demandMonitor.demandedHardwarePerformanceList,
  }
}

export const DemandMonitorTableContainer = connect(mapStoreToProps, DemandMonitorTable)
