import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { VeggieName } from '../../../components'

const styles = (theme: SaladTheme) => ({
  container: {
    color: theme.darkBlue,
    display: 'flex',
    flexDirection: 'row',
  },
  stat: {
    width: 140,
    marginRight: '5rem',
  },
  statTitle: {
    overflowWrap: 'break-word',
    whiteSpace: 'normal',
  },
  statValue: {
    fontFamily: theme.fontGroteskLight09,
    fontSize: 72,
  },
})

interface Props extends WithStyles<typeof styles> {
  totalEarned?: number
  potentialEarned?: number
}

class _ReferralStats extends Component<Props> {
  render() {
    const { totalEarned, potentialEarned, classes } = this.props

    return (
      <div className={classes.container}>
        <div className={classes.stat}>
          <VeggieName className={classes.statTitle}>Total Earned</VeggieName>
          <div className={classes.statValue}>${totalEarned && totalEarned.toFixed(2)}</div>
        </div>
        <div className={classes.stat}>
          <VeggieName className={classes.statTitle}>Potential Earnings</VeggieName>
          <div className={classes.statValue}>${potentialEarned && potentialEarned.toFixed(2)}</div>
        </div>
      </div>
    )
  }
}

export const ReferralStats = withStyles(styles)(_ReferralStats)
