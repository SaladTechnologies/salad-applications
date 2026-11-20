import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { ReplaceBonusModal } from './components/ReplaceBonusModal'

const mapStoreToProps = (store: RootStore): any => {
  const replaceCurrentEarningRate = () => {
    store.bonuses.replaceCurrentEarningRate()
    store.ui.hideModal('/account/bonuses')
  }

  const handleClose = () => {
    store.bonuses.clearReplacementEarningRateBonusId()
    store.ui.hideModal('/account/bonuses')
  }

  return {
    currentEarningBonus: store.bonuses.currentEarningBonus?.multiplier,
    onCloseClicked: () => handleClose(),
    onReplaceCurrentBonus: () => replaceCurrentEarningRate(),
  }
}

export const ReplaceBonusModalContainer = connect(mapStoreToProps, ReplaceBonusModal)
