import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SectionHeader } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { ClearFilterItem } from './ClearFilterItem'
import { RewardFilterRow } from './RewardFilterRow'

const styles = (theme: SaladTheme) => ({
  container: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: 12,
    color: theme.lightGreen,
    padding: 10,
  },
  sectionContainer: {
    padding: 10,
  },
  checkbox: {
    padding: '5px 0',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedText: {
    paddingTop: 8,
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
  textbox: {
    width: '50%',
  },
})

export interface FilterOption {
  value: any
  count: number
  selected: boolean
}

export interface RangeFilterOption extends FilterOption {
  value: RangeValue
}

type RangeValue = { name?: string; to?: number; from?: number }

interface Props extends WithStyles<typeof styles> {
  label?: string
  options?: RangeFilterOption[]
  onChange?: (value: RangeValue) => void
  onSelect?: (value: RangeValue) => void
  onRemove?: (value: RangeValue) => void
}

class _RewardPriceFilter extends Component<Props> {
  handleClick = (option: RangeFilterOption) => {
    const { onChange } = this.props
    if (!option) return
    onChange?.(option.value)
  }

  render() {
    const { label, options, classes, onRemove } = this.props

    if (!options) return null

    const selected = options.find((x) => x.selected)

    return (
      <div className={classes.container}>
        <SectionHeader>{label}</SectionHeader>
        {!selected &&
          options.map((x) => (
            <RewardFilterRow
              key={x.value.name}
              hideCheckbox
              text={x.value.name}
              selected={x.selected}
              count={x.count}
              onClick={() => this.handleClick(x)}
            />
          ))}
        {selected && <div className={classes.selectedText}>{selected.value.name}</div>}
        <ClearFilterItem options={options} onRemove={onRemove} />
      </div>
    )
  }
}

export const RewardPriceFilter = withStyles(styles)(_RewardPriceFilter)
