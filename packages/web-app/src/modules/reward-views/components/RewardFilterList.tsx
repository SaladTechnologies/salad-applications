import { Facet, Sorting } from '@elastic/react-search-ui'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Dropdown } from '../../../components/Dropdown'
import { RewardFilterPanel } from './RewardFilterPanel'
import { RewardPriceFilter } from './RewardPriceFilter'

const styles = {}

interface Props extends WithStyles<typeof styles> {}

class _RewardFilterList extends Component<Props> {
  render() {
    return (
      <div>
        <Sorting
          sortOptions={[
            {
              name: 'Relevance',
              value: '',
              direction: '',
            },
            {
              name: 'Name',
              value: 'name',
              direction: 'asc',
            },
            {
              name: 'Lowest Price',
              value: 'price',
              direction: 'asc',
            },
            {
              name: 'Highest Price',
              value: 'price',
              direction: 'desc',
            },
          ]}
          view={(props) => {
            const { onChange, ...rest } = props
            return (
              <Dropdown
                onChange={(o) => {
                  onChange(o.value)
                }}
                {...rest}
              />
            )
          }}
        />
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
