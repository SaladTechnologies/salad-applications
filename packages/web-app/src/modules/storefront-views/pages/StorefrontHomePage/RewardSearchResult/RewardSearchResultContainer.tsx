import { withSearch } from '@elastic/react-search-ui'
import type { RootStore } from '../../../../../Store'
import { useStore } from '../../../../../Store'
import { routeLink } from '../../../../../utils'
import { RewardSearchResult } from './RewardSearchResult'

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

const SearchingRewardSearchResult = withSearch(({ error, results, clearFilters }) => ({
  error,
  results,
  clearFilters,
}))(RewardSearchResult)

/** The search results page, which opens a reward or goes back to the storefront. */
export const RewardSearchResultContainer = () => <SearchingRewardSearchResult {...mapStoreToProps(useStore())} />
