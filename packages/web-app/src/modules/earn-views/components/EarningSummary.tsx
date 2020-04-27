import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { StatElement } from '../../../components'
import { SaladTheme } from '../../../SaladTheme'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  title: {
    fontFamily: theme.fontGroteskBook25,
    textTransform: 'uppercase',
    fontSize: 10,
    color: theme.lightGreen,
    letterSpacing: '1px',
  },
})

interface Props extends WithStyles<typeof styles> {
  currentBalance?: number
  lifetimeBalance?: number
}

class _EarningSummary extends Component<Props> {
  render() {
    const { currentBalance, lifetimeBalance, classes } = this.props

    return (
      <div className={classes.container}>
        <StatElement
          title={'Current Balance'}
          values={[`$${currentBalance ? currentBalance.toFixed(2) : 0}`]}
          infoText={'Current balance available to spend'}
        />
        <StatElement
          title={'Lifetime Balance'}
          values={[`$${lifetimeBalance ? lifetimeBalance.toFixed(2) : 0}`]}
          infoText={'Total balance earned'}
        />
      </div>
    )
  }
}

export const EarningSummary = withStyles(styles)(_EarningSummary)
