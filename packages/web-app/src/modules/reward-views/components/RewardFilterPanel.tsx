import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import classnames from 'classnames'
import { Divider, Checkbox, Slider } from '../../../components'

const styles = (theme: SaladTheme) => ({
  container: {
    fontFamily: theme.fontGroteskBook19,
    maxWidth: 250,
  },
  sectionContainer: {
    padding: '0 20px',
  },
  pri: {
    display: 'flex',
    paddingInlineStart: 0, //Removes the default left padding for a <ul/>
    marginBottom: 0,
  },
})

export interface ToggleFilter {
  label: string
  active: boolean
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
}

class _RewardFilterPanel extends Component<Props> {
  render() {
    const { priceFilter, stockFilter, redeemableFilter, tagFilters, classes } = this.props

    return (
      <div className={classnames(classes.container)}>
        {priceFilter && (
          <div className={classnames(classes.sectionContainer)}>
            <Slider
              stepSize={5}
              minimum={0}
              maximum={65}
              value={priceFilter.value}
              onValueChange={priceFilter.onChance}
            />
          </div>
        )}
        <Divider narrow />
        <div className={classnames(classes.sectionContainer)}>
          {stockFilter && (
            <Checkbox text={stockFilter.label} checked={stockFilter.active} onClick={stockFilter.onToggle} />
          )}
          {redeemableFilter && (
            <Checkbox
              text={redeemableFilter.label}
              checked={redeemableFilter.active}
              onClick={redeemableFilter.onToggle}
            />
          )}
        </div>
        <Divider narrow />
        <div className={classnames(classes.sectionContainer)}>
          {tagFilters && tagFilters.map((x) => <Checkbox text={x.label} checked={x.active} onClick={x.onToggle} />)}
        </div>
      </div>
    )
  }
}

export const RewardFilterPanel = withStyles(styles)(_RewardFilterPanel)
