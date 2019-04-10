import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { currencyFormatter } from '../../../Formatters'

const elementStyles = (theme: SaladTheme) => ({
  container: {
    textTransform: 'uppercase',
    fontFamily: 'sharpGroteskBook25',
    fontSize: theme.small,
    padding: '.5rem 1.5rem',
    textAlign: 'right',
  },
  title: {
    color: theme.mediumGreen,
  },
  value: {
    color: theme.lightGreen,
  },
})

interface ElementProps extends WithStyles<typeof elementStyles> {
  title?: string
  value?: string
}

// Define the component using these styles and pass it the 'classes' prop.
// Use this to assign scoped class names.
const _StatElement = ({ title, value, classes }: ElementProps) => (
  <div className={classes.container}>
    <div className={classes.title}>{title}</div>
    <div className={classes.value}>{value}</div>
  </div>
)

// Finally, inject the stylesheet into the component.
const StatElement = withStyles(elementStyles)(_StatElement)

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'inline-flex',
    flexDirection: 'column',
    userSelect: 'none',
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
        <StatElement title="Lifetime earning" value={currencyFormatter.format(lifetimeEarning || 0)} />
        <StatElement title="Referrals" value={referralCount !== undefined ? referralCount.toFixed(0) : 'Unknown'} />
        <StatElement title="Machines" value={machineCount !== undefined ? machineCount.toFixed(0) : 'Unknown'} />
        <StatElement title="Leaderboard" value={'Coming Soon'} />
      </div>
    )
  }
}

export const UserStatsSummary = withStyles(styles)(_UserStatsSummary)
