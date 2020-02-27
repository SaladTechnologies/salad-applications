import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { ChoppingCartButton } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  rewards: store.rewards.choppingCart,
  onViewReward: store.ui.showReward,
})

export const ChoppingCartButtonContainer = connect(mapStoreToProps, ChoppingCartButton)
