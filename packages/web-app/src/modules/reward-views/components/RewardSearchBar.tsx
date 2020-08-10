import React, { Component } from 'react'
import { SearchBar } from '../../../components'

interface Props {
  searchTerm?: string
  setSearchTerm?: (text: string, options: {}) => void
}

class _RewardSearchBar extends Component<Props> {
  handleText = (text: string) => {
    const { setSearchTerm } = this.props

    setSearchTerm?.(text, { shouldClearFilters: false })
  }
  render() {
    const { searchTerm } = this.props
    return <SearchBar text={searchTerm} onTextEntered={this.handleText} />
  }
}

export const RewardSearchBar = _RewardSearchBar
