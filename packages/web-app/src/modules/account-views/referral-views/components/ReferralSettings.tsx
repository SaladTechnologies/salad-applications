import classnames from 'classnames'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import type { SaladTheme } from '../../../../SaladTheme'
import { Divider, Head, SectionHeader } from '../../../../components'
import { withLogin } from '../../../auth-views'
import type { Referral } from '../../../referral/models'
import { ReferralCodeContainer } from '../ReferralCodeContainer'
import { ReferralListContainer } from '../ReferralListContainer'
import { ReferralStatsContainer } from '../ReferralStatsContainer'
import { SendReferralContainer } from '../SendReferralContainer'
import { CurrentReferralProgress } from './CurrentReferralProgress'
import { ReferralDescription } from './ReferralDescription'

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
  referral: Referral
}

const _ReferralSettings = ({ classes, referral }: Props) => (
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
        <ReferralCodeContainer />
        <SectionHeader>Send Referral</SectionHeader>
        <SendReferralContainer />
        <Divider />
        <ReferralDescription />
      </div>
      <div className={classes.column}>
        <ReferralStatsContainer />
        <ReferralListContainer />
      </div>
    </div>
  </div>
)

export const ReferralSettings = withLogin(withStyles(styles)(_ReferralSettings))
