import { Facet } from '@elastic/react-search-ui'
import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { RewardFilterPanel } from './RewardFilterPanel'
import { RewardPriceFilter } from './RewardPriceFilter'

const styles = {}

interface Props extends WithStyles<typeof styles> {}

class _RewardFilterList extends Component<Props> {
  render() {
    return (
      <div>
        <Facet field="price" label="Price" filterType="all" view={(props) => <RewardPriceFilter {...props} />} />
        <Facet
          field="tags"
          label="Category"
          filterType="all"
          view={(props) => <RewardFilterPanel {...props} multiSelect />}
        />
        <Facet field="platform" label="Platform" filterType="all" view={(props) => <RewardFilterPanel {...props} />} />
      </div>
    )
  }
}

export const RewardFilterList = withStyles(styles)(_RewardFilterList)
