import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { SearchBar } from '../../components'

const mapStoreToProps = (store: RootStore): any => ({
  onTextEntered: store.rewards.updateSearch,
})

export const RewardSearchBarContainer = connect(mapStoreToProps, SearchBar)
