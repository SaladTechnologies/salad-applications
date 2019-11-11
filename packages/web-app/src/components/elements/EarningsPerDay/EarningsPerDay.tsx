import React, { Component } from 'react'

// Styles
import { styles } from './EarningsPerDay.styles'

// Components
import { RewardHeader } from '../../index'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'

interface Props extends WithStyles<typeof styles> {
  earnings: number | string | undefined
  className?: string
}

class _EarningsPerDay extends Component<Props> {
  render() {
    const { earnings, className, classes } = this.props

    return (
      <div className={classnames(className)}>
        <RewardHeader>
          Average
          <br />
          earnings per day
        </RewardHeader>
        <div className={classnames(classes.earningsPerDay)}>${earnings || '-.--'}</div>
      </div>
    )
  }
}

export const EarningsPerDay = withStyles(styles)(_EarningsPerDay)
