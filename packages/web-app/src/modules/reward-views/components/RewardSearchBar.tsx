import { withSearch } from '@elastic/react-search-ui'
import React, { Component } from 'react'
import { SearchBar } from '../../../components'

interface Props {
  searchTerm?: string
  setSearchTerm?: (text: string) => void
}

class _RewardSearchBar extends Component<Props> {
  render() {
    const { searchTerm, setSearchTerm } = this.props
    return <SearchBar text={searchTerm} onTextEntered={setSearchTerm} />
  }
}

export const RewardSearchBar = withSearch(({ searchTerm, setSearchTerm }) => ({
  searchTerm,
  setSearchTerm,
}))(_RewardSearchBar)
