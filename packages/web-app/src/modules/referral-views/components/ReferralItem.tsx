import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'
import { Referral } from '../../referral/models'
import { AppBody, ProgressBar } from '../../../components'

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
    backgroundColor: theme.darkGreen,
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
  render() {
    const { referral, classes } = this.props
    if (!referral || !referral.referralDefinition) return null
    return (
      <div key={referral.refereeId} className={classnames(classes.container)}>
        <div className={classes.headerContainer}>
          <AppBody>
            {referral.percentComplete === 1 ? 'COMPLETED' : `$${referral.currentEarned.toFixed(2)} EARNED`}
          </AppBody>
          <AppBody className={classes.bonusText}>
            ${referral.referralDefinition.maximumReferrerBonus.toFixed(2)} BONUS
          </AppBody>
        </div>
        <ProgressBar
          className={classes.progressBackground}
          barClassName={classes.progressBar}
          progress={referral.percentComplete * 100}
        />
      </div>
    )
  }
}

export const ReferralItem = withStyles(styles)(_ReferralItem)
