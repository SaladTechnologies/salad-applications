import { withSearch } from '@elastic/react-search-ui'
import { RewardSearchBar } from '../../../../reward-views/components'

const SearchingRewardSearchBar = withSearch(({ searchTerm, setSearchTerm, error }) => ({
  error,
  searchTerm,
  setSearchTerm,
}))(RewardSearchBar)

/** The storefront's search bar, which reads and sets the search term. */
export const RewardSearchBarContainer = () => <SearchingRewardSearchBar />
