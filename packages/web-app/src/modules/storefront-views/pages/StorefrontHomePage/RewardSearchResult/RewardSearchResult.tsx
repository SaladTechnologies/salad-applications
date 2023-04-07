import type { Result } from '@elastic/react-search-ui'
import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { SearchResult } from '../../../../reward/models'
import { BrowseRewardsPage } from './BrowseRewardsPage'

const styles = {}

interface Props extends WithStyles<typeof styles> {
  title?: string
  error?: string
  results?: Result[]
  clearFilters?: () => void
  onBack?: () => void
  onClickReward: (to: string, action?: Function) => void
}

class _RewardSearchResult extends Component<Props> {
  handleBack = () => {
    const { clearFilters, onBack } = this.props

    clearFilters?.()

    onBack?.()
  }

  public override render(): ReactNode {
    const { results, onClickReward, ...rest } = this.props

    const searchResults = results?.map(SearchResult.parseSearchResult)
    return (
      <BrowseRewardsPage results={searchResults} onBack={this.handleBack} onClickReward={onClickReward} {...rest} />
    )
  }
}

export const RewardSearchResult = withStyles(styles)(_RewardSearchResult)
