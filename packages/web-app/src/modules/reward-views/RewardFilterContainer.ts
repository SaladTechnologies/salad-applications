import { connect } from '../../connect'
import { RewardFilterPage } from './components/RewardFilterPage'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore): any => ({
  searchText: store.rewards.filterText,
  filters: store.rewards.currentFilters,
  onTextEntered: store.rewards.updateFilterText,
  onToggle: store.rewards.toggleFilter,
})

export const RewardFilterContainer = connect(
  mapStoreToProps,
  RewardFilterPage,
)
