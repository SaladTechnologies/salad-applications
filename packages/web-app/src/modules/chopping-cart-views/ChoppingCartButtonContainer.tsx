import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { ChoppingCartButton } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  rewards: store.rewards.choppingCart,
  onViewReward: store.rewards.viewReward,
})

export const ChoppingCartButtonContainer = connect(mapStoreToProps, ChoppingCartButton)
