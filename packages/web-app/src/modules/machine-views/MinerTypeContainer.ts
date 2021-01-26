import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { MinerTypePanel } from './components/MinerTypePanel'

const mapStoreToProps = (store: RootStore): any => {
  const gpuMiningEnabled = store.saladBowl.gpuMiningEnabled

  const compatibilityDetectionOverridden = gpuMiningEnabled
    ? store.saladBowl.gpuMiningOverridden
    : store.saladBowl.cpuMiningOverridden

  const onSetOverride = (value: boolean) => {
    gpuMiningEnabled ? store.saladBowl.setGpuOverride(value) : store.saladBowl.setCpuOverride(value)
  }

  return {
    compatibilityDetectionOverridden,
    gpuOnly: gpuMiningEnabled,
    isRunning: store.saladBowl.isRunning,
    onSetGpuOnly: store.saladBowl.setGpuOnly,
    onSetOverride,
  }
}

export const MinerTypeContainer = connect(mapStoreToProps, MinerTypePanel)
