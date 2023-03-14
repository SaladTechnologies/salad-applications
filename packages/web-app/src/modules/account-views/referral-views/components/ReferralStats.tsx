import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
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
  public override render(): ReactNode {
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
          infoText={'Total bonus amount you will earn when all your referrals complete'}
        />
      </div>
    )
  }
}

export const ReferralStats = withStyles(styles)(_ReferralStats)
