import React, { Component } from 'react'

// Styles
import { styles } from './EarningsOverTime.styles'

// Components
import { RewardHeader } from '../../index'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {
  rewards: number | string
  hours?: number | string
  days?: number | string
  className?: string
}

class _EarningsOverTime extends Component<Props> {
  render() {
    const { rewards, hours, days, className, classes } = this.props

    return (
      <div className={classnames(className)}>
        <RewardHeader>
          Rewards available
          <br />
          in the first {hours && `${hours} hours`}
          {days && `${days} day ${days > 1 ? 'days' : 'day'}`}
        </RewardHeader>
        <div className={classnames(classes.rewardsOverTime)}>{rewards}</div>
      </div>
    )
  }
}

export const EarningsOverTime = withStyles(styles)(_EarningsOverTime)
