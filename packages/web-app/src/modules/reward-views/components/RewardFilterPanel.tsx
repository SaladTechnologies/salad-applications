import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SectionHeader } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'
import { RewardFilterRow } from './RewardFilterRow'

const styles = (theme: SaladTheme) => ({
  container: {
    fontFamily: theme.fontGroteskBook19,
    fontSize: 12,
    color: theme.lightGreen,
    padding: 10,
  },
  sortContainer: {
    padding: 5,
  },
  sortLabel: {
    paddingBottom: 5,
  },
  sectionContainer: {
    padding: 10,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
  },
  countLabel: {
    marginLeft: 'auto',
  },
})

interface FilterOption {
  value: string
  count: number
  selected: boolean
}

interface Props extends WithStyles<typeof styles> {
  label?: string
  options?: FilterOption[]
  onSelect?: (value: string) => void
  onRemove?: (value: string) => void
}

class _RewardFilterPanel extends Component<Props> {
  handleClick = (checked: boolean, option: FilterOption) => {
    const { onSelect, onRemove } = this.props
    if (!option) return
    if (checked) {
      onSelect?.(option.value)
    } else {
      onRemove?.(option.value)
    }
  }

  render() {
    const { label, options, classes } = this.props

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
              onClick={(checked) => this.handleClick(checked, x)}
            />
          ))}
      </div>
    )
  }
}

export const RewardFilterPanel = withStyles(styles)(_RewardFilterPanel)
