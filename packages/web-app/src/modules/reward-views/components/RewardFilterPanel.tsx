import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import classnames from 'classnames'
import { Divider, Checkbox, Slider } from '../../../components'
import Select, { ValueType } from 'react-select'
import { RewardSort } from '../../reward/models'

const styles = (theme: SaladTheme) => ({
  container: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: 12,
    color: theme.lightGreen,
  },
  sortContainer: {
    padding: 5,
  },
  sortLabel: {
    paddingBottom: 5,
  },
  sectionContainer: {
    padding: '0 10px',
  },
  checkbox: {
    padding: '5px 0',
  },
  priceLabel: {
    textAlign: 'center',
    marginTop: -5,
    paddingBottom: 10,
  },
})

export interface SortOptions {
  value: RewardSort
  onChange: (value: RewardSort) => void
}

export interface ToggleFilter {
  label: string
  active: boolean
  count: number
  onToggle: () => void
}

export interface SliderFilter {
  label: string
  value: number
  onChance: (value: number) => void
}

interface Props extends WithStyles<typeof styles> {
  priceFilter?: SliderFilter
  stockFilter?: ToggleFilter
  redeemableFilter?: ToggleFilter
  tagFilters?: ToggleFilter[]
  sortOptions?: SortOptions
}

type SortOptionType = { value: string; label: string }

const getLabelString = (filter: ToggleFilter): string => {
  if (filter.count > 0) {
    return `${filter.label} (${filter.count})`
  } else return filter.label
}

const customStyles = {
  singleValue: (provided: any, state: any) => {
    const opacity = state.isDisabled ? 0.5 : 1
    const transition = 'opacity 300ms'
    const color = '#DBF1C1'

    return { ...provided, opacity, transition, color }
  },
}

const filterOptions = [
  { label: 'Default', value: RewardSort.Default },
  { label: 'Name', value: RewardSort.Alphabetical },
  { label: 'Highest Price', value: RewardSort.PriceDescending },
  { label: 'Lowest Price', value: RewardSort.PriceAscending },
]

class _RewardFilterPanel extends Component<Props> {
  handleSortChange = (selected: ValueType<SortOptionType>) => {
    const { sortOptions } = this.props

    if (!selected) {
      return
    }

    const newValue = (selected as SortOptionType).value

    sortOptions?.onChange(newValue as RewardSort)
  }

  render() {
    const { priceFilter, sortOptions, stockFilter, redeemableFilter, tagFilters, classes } = this.props

    return (
      <div className={classes.container}>
        {sortOptions && (
          <>
            <div className={classes.sortContainer}>
              <div className={classes.sortLabel}>Sort Order:</div>
              <Select
                options={filterOptions}
                onChange={this.handleSortChange}
                defaultValue={filterOptions[0]}
                styles={customStyles}
                theme={(selectTheme) => ({
                  // TODO: Get the theme data using react-jss
                  ...selectTheme,
                  borderRadius: 0,
                  colors: {
                    ...selectTheme.colors,
                    neutral0: '#0A2133',
                    primary25: '#1F4F22',
                    primary: '#DBF1C1',
                    neutral20: '#DBF1C1',
                  },
                })}
              />
            </div>
            <Divider narrow />
          </>
        )}
        {priceFilter && (
          <>
            <div className={classnames(classes.sectionContainer)}>
              <Slider
                stepSize={5}
                minimum={0}
                maximum={65}
                value={priceFilter.value}
                onValueChange={priceFilter.onChance}
              />
              <div className={classnames(classes.priceLabel)}>{priceFilter.label}</div>
            </div>
            <Divider narrow />
          </>
        )}

        <div className={classnames(classes.sectionContainer)}>
          {stockFilter && (
            <Checkbox
              className={classes.checkbox}
              text={getLabelString(stockFilter)}
              checked={stockFilter.active}
              onClick={stockFilter.onToggle}
              disabled={stockFilter.count === 0}
            />
          )}
          {redeemableFilter && (
            <Checkbox
              className={classes.checkbox}
              text={getLabelString(redeemableFilter)}
              checked={redeemableFilter.active}
              onClick={redeemableFilter.onToggle}
              disabled={redeemableFilter.count === 0}
            />
          )}
        </div>
        <Divider narrow />
        <div className={classnames(classes.sectionContainer)}>
          {tagFilters &&
            tagFilters.map((x) => (
              <Checkbox
                key={x.label}
                className={classes.checkbox}
                text={getLabelString(x)}
                checked={x.active}
                onClick={x.onToggle}
                disabled={x.count === 0}
              />
            ))}
        </div>
      </div>
    )
  }
}

export const RewardFilterPanel = withStyles(styles)(_RewardFilterPanel)
