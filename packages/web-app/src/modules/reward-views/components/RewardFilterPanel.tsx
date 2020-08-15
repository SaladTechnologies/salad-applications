import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Checkbox, SectionHeader } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { ClearFilterItem } from './ClearFilterItem'
import { RewardFilterRow } from './RewardFilterRow'
import { FilterOption } from './RewardPriceFilter'

const styles = (theme: SaladTheme) => ({
  container: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: 12,
    color: theme.lightGreen,
    padding: 10,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  showMore: {
    paddingTop: 10,
  },
})

export interface ValueFilterOption extends FilterOption {
  value: string
}

interface Props extends WithStyles<typeof styles> {
  label?: string
  options?: ValueFilterOption[]
  multiSelect?: boolean
  showMore?: boolean
  onMoreClick?: () => void
  onChange?: (value: string) => void
  onSelect?: (value: string) => void
  onRemove?: (value: string) => void
}

class _RewardFilterPanel extends Component<Props> {
  handleClick = (checked: boolean, option: ValueFilterOption) => {
    const { multiSelect, onChange, onSelect, onRemove } = this.props
    if (!option) return

    if (multiSelect) {
      if (checked) {
        onSelect?.(option.value)
      } else {
        onRemove?.(option.value)
      }
    } else {
      onChange?.(option.value)
    }
  }

  clearFilters = () => {
    const { options, onRemove } = this.props

    options?.filter((x) => x.selected).forEach((x) => onRemove?.(x.value))
  }

  showMore = () => {
    const { showMore, onMoreClick } = this.props

    if (!showMore) return

    onMoreClick?.()
  }

  render() {
    const { label, options, multiSelect, showMore, classes, onRemove } = this.props

    if (!options) return null

    return (
      <div className={classes.container}>
        <SectionHeader>{label}</SectionHeader>
        {options &&
          options.map((x) => (
            <RewardFilterRow
              key={x.value}
              text={x.value}
              selected={x.selected}
              count={x.count}
              hideCheckbox={!multiSelect}
              onClick={(checked) => this.handleClick(checked, x)}
            />
          ))}
        {showMore && <Checkbox text="Show More..." onClick={this.showMore} hideCheckbox={true} />}

        <ClearFilterItem options={options} onRemove={onRemove} />
      </div>
    )
  }
}

export const RewardFilterPanel = withStyles(styles)(_RewardFilterPanel)
