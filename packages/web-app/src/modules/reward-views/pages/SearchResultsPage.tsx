import { Result } from '@elastic/react-search-ui'
import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { BrowseRewardsPage } from '.'
import { SearchResult } from '../../reward/models'

const styles = () => ({})

interface Props extends WithStyles<typeof styles> {
  title?: string
  results?: Result[]
  onBack?: () => void
}

class _SearchResultsPage extends Component<Props> {
  render() {
    const { results, ...rest } = this.props
    const searchResults = results?.map(SearchResult.parseSearchResult)
    return <BrowseRewardsPage results={searchResults} {...rest} />
  }
}

export const SearchResultsPage = withStyles(styles)(_SearchResultsPage)
