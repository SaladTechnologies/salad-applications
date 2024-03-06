import classnames from 'classnames'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../../SaladTheme'
import { P, ProgressBar, SectionHeader } from '../../../../components'
import type { Referral } from '../../../referral/models'
import { progressCompletePercentage } from '../../../referral/models'

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
  referral: Referral
}

const _CurrentReferralProgress = ({ classes, referral }: Props) => {
  const { code, earnedBalance, refereeId, referralDefinition } = referral || {}

  const progressPercentage = progressCompletePercentage(earnedBalance, referralDefinition?.balanceThreshold ?? 1)
  const bonusRate = (1 + (referralDefinition?.bonusRate ?? 0)).toFixed(2)

  return (
    <div key={refereeId} className={classnames(classes.container)}>
      <SectionHeader>Your Progress</SectionHeader>

      <div className={classes.headerContainer}>
        <P>CODE: {code}</P>
        <P className={classes.bonusText}>{progressPercentage === 100 ? 'COMPLETED' : `${bonusRate}x EARNING RATE`}</P>
      </div>
      <ProgressBar
        className={classes.progressBackground}
        barClassName={classes.progressBar}
        progress={progressPercentage}
      />
    </div>
  )
}

export const CurrentReferralProgress = withStyles(styles)(_CurrentReferralProgress)
