import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { OverrideCompatibilityDetection } from './components/OverrideCompatibilityDetection'

const mapStoreToProps = (store: RootStore): any => {
  const gpuMiningEnabled = store.saladBowl.gpuMiningEnabled

  const onOverride = () => {
    gpuMiningEnabled ? store.saladBowl.setGpuOverride(true) : store.saladBowl.setCpuOverride(true)
    store.ui.hideModal() // possibly pass true here?
    // TODO: In the machine store, add a mixpanel tracking event to let them know if there is an override
  }

  return {
    onCloseClicked: () => store.ui.hideModal(true),
    onOverride,
  }
}

export const OverrideCompatibilityDetectionContainer = connect(mapStoreToProps, OverrideCompatibilityDetection)
