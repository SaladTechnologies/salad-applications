import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { StatElement } from '../../../../components'

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'space-evenly',
    padding: 20,
  },
  stat: {
    flexGrow: 1,
    flexBasis: 0,
  },
}

interface Props extends WithStyles<typeof styles> {
  totalEarned?: number
  potentialEarned?: number
}

class _ReferralStats extends Component<Props> {
  render() {
    const { totalEarned, potentialEarned, classes } = this.props

    return (
      <div className={classes.container}>
        <StatElement
          title={'Total Earned'}
          values={[`$${totalEarned ? totalEarned.toFixed(2) : 0}`]}
          infoText={'Total bonus amount you have already earned'}
        />
        <StatElement
          title={'Potential Earnings'}
          values={[`$${potentialEarned ? potentialEarned.toFixed(2) : 0}`]}
          infoText={'Total balance earned'}
        />
      </div>
    )
  }
}

export const ReferralStats = withStyles(styles)(_ReferralStats)
