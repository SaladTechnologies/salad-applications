import { withSearch } from '@elastic/react-search-ui'
import { connect } from '../../connect'
import { RewardSearchBar } from './components'

const mapStoreToProps = (): any => ({})

export const RewardSearchBarContainer = connect(
  mapStoreToProps,
  withSearch(({ searchTerm, setSearchTerm }) => ({
    searchTerm,
    setSearchTerm,
  }))(RewardSearchBar),
)
