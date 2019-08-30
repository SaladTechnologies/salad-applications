import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'
import { Referral } from '../../referral/models'
import { AppBody, VeggieName, ProgressBar } from '../../../components'

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

class _CurrentReferralProgress extends Component<Props> {
  render() {
    const { referral, classes } = this.props
    if (!referral || !referral.referralDefinition) return null
    return (
      <div key={referral.refereeId} className={classnames(classes.container)}>
        <VeggieName>Your Progress</VeggieName>

        <div className={classes.headerContainer}>
          <AppBody>CODE: {referral.code}</AppBody>
          <AppBody className={classes.bonusText}>
            {referral.percentComplete === 1 ? 'COMPLETED' : (1 + referral.referralDefinition.bonusRate).toFixed(1)}x
            EARNING RATE
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

export const CurrentReferralProgress = withStyles(styles)(_CurrentReferralProgress)
