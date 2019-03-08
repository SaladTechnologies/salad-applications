import { connect } from '../../connect'
import { RewardFilterPage } from './components/RewardFilterPage'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore) => ({
  searchText: store.rewards.filterText,
  filters: store.rewards.filters,
  onTextEntered: store.rewards.updateFilterText,
  onToggle: store.rewards.toggleFilter,
})

export const RewardFilterContainer = connect(
  mapStoreToProps,
  RewardFilterPage,
)
