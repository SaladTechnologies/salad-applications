import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { currencyFormatter } from '../../../Formatters'
import { StatElement } from '../../../components/elements/StatElement/StatElement'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'inline-flex',
    flexDirection: 'column',
    userSelect: 'none',
    alignItems: 'flex-end',
  },
})

interface Props extends WithStyles<typeof styles> {
  lifetimeEarning?: number
  referralCount?: number
  machineCount?: number
}

class _UserStatsSummary extends Component<Props> {
  render() {
    const { lifetimeEarning, referralCount, machineCount, classes } = this.props
    return (
      <div className={classes.container}>
        <StatElement title="Lifetime earning" values={[currencyFormatter.format(lifetimeEarning || 0)]} />
        <StatElement title="Referrals" values={[referralCount !== undefined ? referralCount.toFixed(0) : 'Unknown']} />
        <StatElement title="Machines" values={[machineCount !== undefined ? machineCount.toFixed(0) : 'Unknown']} />
        <StatElement title="Leaderboard" values={['Coming Soon']} />
      </div>
    )
  }
}

export const UserStatsSummary = withStyles(styles)(_UserStatsSummary)
