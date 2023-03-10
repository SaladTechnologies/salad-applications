import classnames from 'classnames'
import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { P, ProgressBar } from '../../../../components'
import type { SaladTheme } from '../../../../SaladTheme'
import type { Referral } from '../../../referral/models'
import { currentEarned, percentComplete } from '../../../referral/models'
import { maximumReferrerBonus } from '../../../referral/models/ReferralDefinition'

const styles = (theme: SaladTheme) => ({
  container: {
    userSelect: 'none',
    paddingBottom: '1rem',
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bonusText: {
    marginLeft: 'auto',
  },
  progressBackground: {
    borderRadius: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.20)',
    height: '4px',
  },
  progressBar: {
    backgroundColor: theme.lightGreen,
    boxShadow: `0px 0px 10px 0px ${theme.lightGreen}`,
  },
})

interface Props extends WithStyles<typeof styles> {
  referral?: Referral
}

class _ReferralItem extends Component<Props> {
  public override render(): ReactNode {
    const { referral, classes } = this.props
    if (!referral || !referral.referralDefinition) return null
    return (
      <div key={referral.refereeId} className={classnames(classes.container)}>
        <div className={classes.headerContainer}>
          <P>{percentComplete(referral) === 1 ? 'COMPLETED' : `$${currentEarned(referral).toFixed(2)} EARNED`}</P>
          <P className={classes.bonusText}>${maximumReferrerBonus(referral.referralDefinition).toFixed(2)} BONUS</P>
        </div>
        <ProgressBar
          className={classes.progressBackground}
          barClassName={classes.progressBar}
          progress={percentComplete(referral) * 100}
        />
      </div>
    )
  }
}

export const ReferralItem = withStyles(styles)(_ReferralItem)
