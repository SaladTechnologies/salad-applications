import React, { Component } from 'react'
import { SaladTheme } from '../../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { Referral } from '../../../referral/models'
import { CondensedHeader, Divider, VeggieName } from '../../../../components'
import { ReferralCodeContainer } from '../ReferralCodeContainer'
import { SendReferralContainer } from '../SendReferralContainer'
import { ReferralDescription } from './ReferralDescription'
import { ReferralStatsContainer } from '../ReferralStatsContainer'
import { ReferralListContainer } from '../ReferralListContainer'
import classnames from 'classnames'
import { CurrentReferralPanelContainer } from '../CurrentReferralPanelContainer'

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
        <div className="header">
          <CondensedHeader>Referrals</CondensedHeader>
        </div>
        <Divider />
        <div className={classnames(classes.content)}>
          <div className={classes.column}>
            <CurrentReferralPanelContainer />
            <Divider />
            <VeggieName>Your Code</VeggieName>
            <ReferralCodeContainer />
            <VeggieName>Send Referral</VeggieName>
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

export const ReferralSettings = withStyles(styles)(_ReferralSettings)
