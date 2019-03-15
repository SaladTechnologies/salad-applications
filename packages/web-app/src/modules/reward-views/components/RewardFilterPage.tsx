import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import classnames from 'classnames'
import { SearchBar } from './SearchBar'
import { FilterList } from './FilterList'
import { FilterItem } from '../../reward/models/FilterItem'

const styles = (theme: SaladTheme) => ({
  container: {
    paddingTop: '2rem',
    userSelect: 'none',
  },
  searchBar: {
    paddingBottom: '1rem',
  },
})

interface Props extends WithStyles<typeof styles> {
  searchText?: string
  filters?: FilterItem[]
  onTextEntered?: (txt: string) => void
  onToggle?: (filter: string) => void
}

class _RewardFilterPage extends Component<Props> {
  render() {
    const { onToggle, filters, searchText, onTextEntered, classes } = this.props

    return (
      <div className={classnames(classes.container)}>
        <SearchBar className={classes.searchBar} text={searchText} onTextEntered={onTextEntered} />
        <FilterList filters={filters} onToggle={onToggle} />
      </div>
    )
  }
}

export const RewardFilterPage = withStyles(styles)(_RewardFilterPage)
