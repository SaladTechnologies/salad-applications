import { withSearch } from '@elastic/react-search-ui'
import { connect } from '../../../../../connect'
import { RewardSearchBar } from '../../../../reward-views/components'

const mapStoreToProps = (): any => ({})

export const RewardSearchBarContainer = connect(
  mapStoreToProps,
  withSearch(({ searchTerm, setSearchTerm, error }) => ({
    error,
    searchTerm,
    setSearchTerm,
  }))(RewardSearchBar),
)
