import classnames from 'classnames'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../../SaladTheme'
import { P, ProgressBar } from '../../../../components'
import { progressCompletePercentage, type Referral } from '../../../referral/models'

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
  referral: Referral
}

const _ReferralItem = ({ classes, referral }: Props) => {
  const { refereeId, referralDefinition, referrerEarnedBalance } = referral
  const { referrerBonusThreshold } = referralDefinition || {}

  return (
    <div key={refereeId} className={classnames(classes.container)}>
      <div className={classes.headerContainer}>
        <P>
          {referrerEarnedBalance === referrerBonusThreshold
            ? 'COMPLETED'
            : `$${referrerEarnedBalance?.toFixed(2)} EARNED`}
        </P>
        <P className={classes.bonusText}>${referrerBonusThreshold?.toFixed(2)} BONUS</P>
      </div>
      <ProgressBar
        className={classes.progressBackground}
        barClassName={classes.progressBar}
        progress={progressCompletePercentage(referrerEarnedBalance, referrerBonusThreshold ?? 1)}
      />
    </div>
  )
}

export const ReferralItem = withStyles(styles)(_ReferralItem)
