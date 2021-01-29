import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { StartReason } from '../salad-bowl/models'
import { NotCompatibleErrorPage } from './components/NotCompatibleErrorPage'

const mapStoreToProps = (store: RootStore): any => {
  const gpuMiningEnabled = store.saladBowl.gpuMiningEnabled

  let currentMinerType: string
  let alternativeMinerType: string
  if (gpuMiningEnabled) {
    currentMinerType = 'GPU'
    alternativeMinerType = 'CPU'
  } else {
    currentMinerType = 'CPU'
    alternativeMinerType = 'GPU'
  }

  store.analytics.trackErrorPageViewed(`No Compatible ${currentMinerType} Error`)

  const onSwitchMiningType = () => {
    store.saladBowl.switchMiningTypeAndStart(true)
    store.ui.hideModal()
  }

  const onOverride = () => {
    store.analytics.trackButtonClicked('override_button', 'Override Button', 'enabled')
    store.ui.hideModal()
    gpuMiningEnabled ? store.saladBowl.setGpuOverride(true) : store.saladBowl.setCpuOverride(true)
    store.saladBowl.start(StartReason.Manual)
  }

  return {
    alternativeMinerType,
    currentMinerType,
    onCloseClicked: () => store.ui.hideModal(true),
    onOverride,
    onSwitchMiningType,
  }
}

export const NotCompatibleErrorContainer = connect(mapStoreToProps, NotCompatibleErrorPage)
