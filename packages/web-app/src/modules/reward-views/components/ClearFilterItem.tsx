import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { FilterOption } from './RewardPriceFilter'

const styles = {
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  clearText: {
    cursor: 'pointer',
    padding: '10px 0',
    '& div': {
      paddingLeft: 5,
    },
    '&:hover': {
      opacity: 0.7,
    },
  },
}

interface Props extends WithStyles<typeof styles> {
  options?: FilterOption[]
  onRemove?: (value: any) => void
}

class _ClearFilterItem extends Component<Props> {
  clearFilters = () => {
    const { options, onRemove } = this.props

    options?.filter((x) => x.selected).forEach((x) => onRemove?.(x.value))
  }

  render() {
    const { options, classes } = this.props

    if (!options) return null

    const selectedCount = options.filter((x) => x.selected).length

    if (selectedCount === 0) return null

    return (
      <div className={classnames(classes.row, classes.clearText)} onClick={this.clearFilters}>
        <FontAwesomeIcon icon={faTimes} />
        <div>{selectedCount === 1 ? 'Clear Filter' : 'Clear Filters'}</div>
      </div>
    )
  }
}

export const ClearFilterItem = withStyles(styles)(_ClearFilterItem)
