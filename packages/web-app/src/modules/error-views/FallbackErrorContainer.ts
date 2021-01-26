import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { StartReason } from '../salad-bowl/models'
import { FallbackErrorPage } from './components/FallbackErrorPage'

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

  const onSwitchMiningType = () => {
    const currentPath = window && window.location.pathname
    store.analytics.trackButtonClicked(currentPath, 'switch_mining_type_button', 'Switch Mining Type Button', 'enabled')
    store.saladBowl.setGpuOnly(!gpuMiningEnabled)
    store.ui.hideModal()
    store.saladBowl.start(StartReason.Manual)
  }

  return {
    alternativeMinerType,
    currentMinerType,
    onCloseClicked: () => store.ui.hideModal(),
    onOpenSupportTicket: () => store.zendesk.openSupportTicket(),
    onSwitchMiningType,
    gpuMiningEnabled,
  }
}

export const FallbackErrorContainer = connect(mapStoreToProps, FallbackErrorPage)
