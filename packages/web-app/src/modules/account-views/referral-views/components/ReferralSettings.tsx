import React, { Component } from 'react'
import { SaladTheme } from '../../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { Referral } from '../../../referral/models'
import { Divider, SectionHeader, Head } from '../../../../components'
import { ReferralCodeContainer } from '../ReferralCodeContainer'
import { SendReferralContainer } from '../SendReferralContainer'
import { ReferralDescription } from './ReferralDescription'
import { ReferralStatsContainer } from '../ReferralStatsContainer'
import { ReferralListContainer } from '../ReferralListContainer'
import classnames from 'classnames'
import { CurrentReferralPanelContainer } from '../CurrentReferralPanelContainer'
import { withLogin } from '../../../auth-views'

const styles = (theme: SaladTheme) => ({
  container: {
    padding: 20,
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
  render() {
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
