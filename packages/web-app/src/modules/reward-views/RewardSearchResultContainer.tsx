import { withSearch } from '@elastic/react-search-ui'
import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { routeLink } from '../../utils'
import { SearchResultsPage } from './pages'

const mapStoreToProps = (store: RootStore): any => {
  const onClickReward = (to: string, action?: any) => {
    if (action) {
      action()
      routeLink(store, to)
    } else {
      routeLink(store, to)
    }
  }
  return {
    onBack: () => store.routing.push('/store'),
    onClickReward,
  }
}

export const RewardSearchResultContainer = connect(
  mapStoreToProps,
  withSearch(({ error, results, clearFilters }) => ({
    error,
    results,
    clearFilters,
  }))(SearchResultsPage),
)
