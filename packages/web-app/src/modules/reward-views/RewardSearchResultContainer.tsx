import { withSearch } from '@elastic/react-search-ui'
import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { SearchResultsPage } from './pages'

const mapStoreToProps = (store: RootStore): any => ({
  onBack: () => store.routing.push(''),
})

export const RewardSearchResultContainer = connect(
  mapStoreToProps,
  withSearch(({ results, clearFilters }) => ({
    results,
    clearFilters,
  }))(SearchResultsPage),
)
