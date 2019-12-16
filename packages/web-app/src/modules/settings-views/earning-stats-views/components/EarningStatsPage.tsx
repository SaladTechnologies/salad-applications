import React, { Component } from 'react'

// UI
import { CondensedHeader, Divider } from '../../../../components'

// Packages
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../../SaladTheme'
import { EarningsChart } from './EarningsChart'

const styles = (theme: SaladTheme) => ({
  container: {
    backgroundColor: theme.green,
  },
})

interface Props extends WithStyles<typeof styles> {}

class _EarningStatsPage extends Component<Props> {
  render() {
    const { classes } = this.props
    return (
      <div className={classes.container}>
        <div className="header">
          <CondensedHeader>Earning Stats</CondensedHeader>
        </div>
        <Divider />
        <CondensedHeader>Average: $1.14/day</CondensedHeader>
        <div>
          <EarningsChart />
        </div>
      </div>
    )
  }
}

export const EarningStatsPage = withStyles(styles)(_EarningStatsPage)
