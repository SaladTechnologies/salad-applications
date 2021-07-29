import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { MinerTypePanel } from './components/MinerTypePanel'

const mapStoreToProps = (store: RootStore): any => {
  const gpuMiningEnabled = store.saladBowl.gpuMiningEnabled

  const compatibilityDetectionOverridden = gpuMiningEnabled
    ? store.saladBowl.gpuMiningOverridden
    : store.saladBowl.cpuMiningOverridden

  const onSetOverride = (value: boolean) => {
    if (!value) {
      gpuMiningEnabled ? store.saladBowl.setGpuOverride(value) : store.saladBowl.setCpuOverride(value)
    } else {
      store.ui.showModal('/warnings/override-compatibility-detection')
    }
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
