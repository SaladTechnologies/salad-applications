import classnames from 'classnames'
import type { ReactNode } from 'react'
import { Component } from 'react'
import type { WithStyles } from 'react-jss'
import withStyles from 'react-jss'
import { Divider, Head, SectionHeader } from '../../../../components'
import type { SaladTheme } from '../../../../SaladTheme'
import { withLogin } from '../../../auth-views'
import type { Referral } from '../../../referral/models'
import { CurrentReferralPanelContainer } from '../CurrentReferralPanelContainer'
import { ReferralCodeContainer } from '../ReferralCodeContainer'
import { ReferralListContainer } from '../ReferralListContainer'
import { ReferralStatsContainer } from '../ReferralStatsContainer'
import { SendReferralContainer } from '../SendReferralContainer'
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
  referrals?: Referral[]
}

class _ReferralSettings extends Component<Props> {
  public override render(): ReactNode {
    const { classes } = this.props

    return (
      <div className={classnames(classes.container)}>
        <Head title="Referrals" />
        <div className={classnames(classes.content)}>
          <div className={classes.column}>
            <CurrentReferralPanelContainer />
            <Divider />
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
  }
}

export const ReferralSettings = withLogin(withStyles(styles)(_ReferralSettings))
