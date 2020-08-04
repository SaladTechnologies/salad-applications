import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { RewardSearchBar } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  setUrl: store.routing.push,
})

export const RewardSearchBarContainer = connect(mapStoreToProps, RewardSearchBar)
