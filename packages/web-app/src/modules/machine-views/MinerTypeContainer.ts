import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { MinerTypePanel } from './components/MinerTypePanel'

const mapStoreToProps = (store: RootStore): any => ({
  gpuOnly: store.saladBowl.gpuMiningEnabled,
  isRunning: store.saladBowl.isRunning,
  onSetGpuOnly: store.saladBowl.setGpuOnly,
})

export const MinerTypeContainer = connect(mapStoreToProps, MinerTypePanel)
