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
  machineCount?: number
  miningStatus?: string
}

class _UserStatsSummary extends Component<Props> {
  render() {
    const { lifetimeEarning, machineCount, miningStatus, classes } = this.props
    return (
      <div className={classes.container}>
        <StatElement title="Mining status" values={[miningStatus || 'Stopped']} />
        <StatElement title="Lifetime earning" values={[currencyFormatter.format(lifetimeEarning || 0)]} />
        <StatElement title="Machines" values={[machineCount !== undefined ? machineCount.toFixed(0) : 'Unknown']} />
      </div>
    )
  }
}

export const UserStatsSummary = withStyles(styles)(_UserStatsSummary)
