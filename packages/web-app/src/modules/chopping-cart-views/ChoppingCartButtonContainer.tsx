import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { ChoppingCartButton } from './components'

const mapStoreToProps = (store: RootStore): any => {
  const onClickChoppingCartIcon = () => {
    const currentPath = window && window.location.pathname
    store.analytics.trackElementClicked(currentPath, 'chopping_knife_icon', 'Chopping Knife Icon')
  }
  return {
    rewards: store.rewards.choppingCart,
    onClickChoppingCartIcon,
  }
}

export const ChoppingCartButtonContainer = connect(mapStoreToProps, ChoppingCartButton)
