import { withSearch } from '@elastic/react-search-ui'
import type { Navigation } from '../../../../../routing/navigation.ts'
import { useNavigation } from '../../../../../routing/navigation-context.ts'
import { routeLink } from '../../../../../utils'
import { RewardSearchResult } from './RewardSearchResult'

const mapStoreToProps = (navigation: Navigation): any => {
  const onClickReward = (to: string, action?: any) => {
    if (action) {
      action()
      routeLink(navigation, to)
    } else {
      routeLink(navigation, to)
    }
  }
  return {
    onBack: () => navigation.push('/store'),
    onClickReward,
  }
}

const SearchingRewardSearchResult = withSearch(({ error, results, clearFilters }) => ({
  error,
  results,
  clearFilters,
}))(RewardSearchResult)

/** The search results page, which opens a reward or goes back to the storefront. */
export const RewardSearchResultContainer = () => <SearchingRewardSearchResult {...mapStoreToProps(useNavigation())} />
