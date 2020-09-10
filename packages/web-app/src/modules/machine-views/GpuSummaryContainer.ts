import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { GpuSummary } from './components/GpuSummary'

const mapStoreToProps = (store: RootStore): any => ({
  gpus: store.machine.gpus,
})

export const GpuSummaryContainer = connect(mapStoreToProps, GpuSummary)
