import { connect, MapStoreToProps } from '../../connect'
import { RewardFilterPage } from './components/RewardFilterPage'

const mapStoreToProps: MapStoreToProps = store => ({
  searchText: store.rewards.filterText,
  filters: store.rewards.filters,
  onTextEntered: store.rewards.updateFilterText,
  onToggle: store.rewards.toggleFilter,
})

export const RewardFilterContainer = connect(
  mapStoreToProps,
  RewardFilterPage,
)
