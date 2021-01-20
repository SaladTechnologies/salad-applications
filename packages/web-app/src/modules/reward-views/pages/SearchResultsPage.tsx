import { Result } from '@elastic/react-search-ui'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { BrowseRewardsPage } from '.'
import { SearchResult } from '../../reward/models'

const styles = {}

interface Props extends WithStyles<typeof styles> {
  title?: string
  error?: string
  results?: Result[]
  clearFilters?: () => void
  onBack?: () => void
  onClickReward: (to: string, action?: Function) => void
}

class _SearchResultsPage extends Component<Props> {
  handleBack = () => {
    const { clearFilters, onBack } = this.props

    clearFilters?.()

    onBack?.()
  }

  render() {
    const { results, onClickReward, ...rest } = this.props

    const searchResults = results?.map(SearchResult.parseSearchResult)
    return (
      <BrowseRewardsPage results={searchResults} onBack={this.handleBack} onClickReward={onClickReward} {...rest} />
    )
  }
}

export const SearchResultsPage = withStyles(styles)(_SearchResultsPage)
