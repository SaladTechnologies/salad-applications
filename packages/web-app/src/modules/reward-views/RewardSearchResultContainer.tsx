import { withSearch } from '@elastic/react-search-ui'
import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { SearchResultsPage } from './pages'

const mapStoreToProps = (store: RootStore): any => ({
  onBack: store.routing.goBack,
})

export const RewardSearchResultContainer = connect(
  mapStoreToProps,
  withSearch(({ results }) => ({
    results,
  }))(SearchResultsPage),
)
