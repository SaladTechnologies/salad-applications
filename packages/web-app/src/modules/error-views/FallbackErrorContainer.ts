import { connect } from '../../connect'
import { RootStore } from '../../Store'
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
    store.saladBowl.switchMiningTypeAndStart(true)
    store.ui.hideModal()
  }

  return {
    alternativeMinerType,
    currentMinerType,
    onCloseClicked: () => store.ui.hideModal(true),
    onOpenSupportTicket: () => store.zendesk.openSupportTicket(),
    onSwitchMiningType,
    gpuMiningEnabled,
  }
}

export const FallbackErrorContainer = connect(mapStoreToProps, FallbackErrorPage)
