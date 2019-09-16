import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
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
  /** The earning rate (USD/s) */
  earningRate?: number
  miningStatus?: string
}

class _UserStatsSummary extends Component<Props> {
  render() {
    const { earningRate, miningStatus, classes } = this.props
    return (
      <div className={classes.container}>
        <StatElement title="Mining status" values={[miningStatus || 'Stopped']} />
        <StatElement
          title="Earning Rate"
          values={[earningRate === undefined ? 'Loading' : `$${(earningRate * 86400).toFixed(3)}/day`]}
        />
      </div>
    )
  }
}

export const UserStatsSummary = withStyles(styles)(_UserStatsSummary)
