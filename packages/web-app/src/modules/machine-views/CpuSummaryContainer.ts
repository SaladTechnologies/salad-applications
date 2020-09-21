import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { CpuSummary } from './components/CpuSummary'

const mapStoreToProps = (store: RootStore): any => ({
  compatibleGpus: store.machine.gpus.some((x) => x.compatible),
  cpuEnabled: store.saladBowl.cpuMiningEnabled,
  isRunning: store.saladBowl.isRunning,
  onSetCpuEnabled: store.saladBowl.setCpuMiningEnabled,
})

export const CpuSummaryContainer = connect(mapStoreToProps, CpuSummary)
