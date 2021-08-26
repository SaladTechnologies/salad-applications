import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { StartActionType } from '../salad-bowl/models'
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
    store.saladBowl.toggleRunning(StartActionType.SwitchMiner)
    store.ui.hideModal()
  }

  const onOverride = () => {
    store.ui.hideModal()
    store.saladBowl.toggleRunning(StartActionType.Override)
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
