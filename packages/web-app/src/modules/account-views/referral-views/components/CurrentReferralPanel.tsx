import classnames from 'classnames'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { ReferralCodeEntryContainer } from '../..'
import { P, SectionHeader } from '../../../../components'
import type { Referral } from '../../../referral/models'
import { CurrentReferralProgress } from './CurrentReferralProgress'

const styles = {
  container: {
    userSelect: 'none',
    paddingBottom: '1rem',
  },
}

interface Props extends WithStyles<typeof styles> {
  referral?: Referral
}

const _CurrentReferralPanel = ({ classes, referral }: Props) => (
  <>
    {referral && referral.referralDefinition && <CurrentReferralProgress referral={referral} />}
    {!referral && (
      <div className={classnames(classes.container)}>
        <SectionHeader>Enter A Code</SectionHeader>
        <P>Received a referral code? Enter it below so you can earn your referral bonus!</P>
        <ReferralCodeEntryContainer />
      </div>
    )}
  </>
)

export const CurrentReferralPanel = withStyles(styles)(_CurrentReferralPanel)
