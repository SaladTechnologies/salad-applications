import classnames from 'classnames'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../../SaladTheme'
import { Divider, Head, SectionHeader } from '../../../../components'
import type { Referral } from '../../../referral/models'
import { CurrentReferralProgress } from './CurrentReferralProgress'
import { ReferralCode } from './ReferralCode'
import { ReferralDescription } from './ReferralDescription'
import { ReferralList } from './ReferralList'
import { ReferralStats } from './ReferralStats'
import { SendReferral } from './SendReferral'

const styles = (theme: SaladTheme) => ({
  container: {
    padding: 20,
    paddingTop: '32px',
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    flexGrow: 1,
    flexBasis: 0,
    display: 'flex',
    flexDirection: 'column',

    '&:first-child': {
      marginRight: theme.xLarge,
    },
  },
})

interface Props extends WithStyles<typeof styles> {
  referral?: Referral | undefined
  code?: string
  sending?: boolean
  onSend?: (email: string) => void
  totalEarned?: number | undefined
  potentialEarned?: number | undefined
  latestReferrals?: Referral[] | undefined
}

const _ReferralSettings = ({
  classes,
  referral,
  code,
  sending,
  onSend,
  totalEarned,
  potentialEarned,
  latestReferrals,
}: Props) => (
  <div className={classnames(classes.container)}>
    <Head title="Referrals" />
    <div className={classnames(classes.content)}>
      <div className={classes.column}>
        {referral && (
          <>
            <CurrentReferralProgress referral={referral} />
            <Divider />
          </>
        )}
        <SectionHeader>Your Code</SectionHeader>
        <ReferralCode code={code} />
        <SectionHeader>Send Referral</SectionHeader>
        <SendReferral sending={sending} onSend={onSend} />
        <Divider />
        <ReferralDescription />
      </div>
      <div className={classes.column}>
        <ReferralStats totalEarned={totalEarned} potentialEarned={potentialEarned} />
        <ReferralList latestReferrals={latestReferrals} />
      </div>
    </div>
  </div>
)

export const ReferralSettings = withStyles(styles)(_ReferralSettings)
