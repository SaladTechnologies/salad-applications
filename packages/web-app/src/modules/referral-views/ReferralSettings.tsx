import React, { Component } from 'react'
import { SaladTheme } from '../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { Referral } from '../referral/models'
import { CondensedHeader, Divider, VeggieName } from '../../components'
import { ReferralCodeContainer } from './ReferralCodeContainer'
import { SendReferralContainer } from './SendReferralContainer'
import { ReferralDescription } from './components/ReferralDescription'
import { ReferralStatsContainer } from './ReferralStatsContainer'
import { ReferralListContainer } from './ReferralListContainer'

const styles = (theme: SaladTheme) => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    padding: '2rem',
  },
  column: {
    flexGrow: 1,
    flexBasis: 0,
    marginRight: '2rem',
    display: 'flex',
    flexDirection: 'column',
  },
})

interface Props extends WithStyles<typeof styles> {
  referrals?: Referral[]
}

class _ReferralSettings extends Component<Props> {
  render() {
    const { classes } = this.props

    return (
      <>
        <CondensedHeader>Referrals</CondensedHeader>
        <Divider />
        <div className={classes.container}>
          <div className={classes.column}>
            {/* TODO: Add in the referral entry component here */}
            <VeggieName>Your Code</VeggieName>
            <ReferralCodeContainer />
            <Divider />
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
      </>
    )
  }
}

export const ReferralSettings = withStyles(styles)(_ReferralSettings)
