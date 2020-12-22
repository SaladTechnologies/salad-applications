import { Component } from 'react'
import { SearchBar } from '../../../components'

interface Props {
  searchTerm?: string
  setSearchTerm?: (text: string, options: {}) => void
  error?: string
}

class _RewardSearchBar extends Component<Props> {
  handleText = (text: string) => {
    const { setSearchTerm } = this.props

    setSearchTerm?.(text, { shouldClearFilters: false })
  }
  render() {
    const { error, searchTerm } = this.props
    return <SearchBar error={error && 'Search Unavailable'} text={searchTerm} onTextEntered={this.handleText} />
  }
}

export const RewardSearchBar = _RewardSearchBar
