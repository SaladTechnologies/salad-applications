import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { Referral } from '../../referral/models'
import { ReferralItem } from './ReferralItem'
import { VeggieName, AppBody } from '../../../components'

const styles = (theme: SaladTheme) => ({
  container: {
    color: theme.darkBlue,
  },
})

interface Props extends WithStyles<typeof styles> {
  referrals?: Referral[]
}

class _ReferralList extends Component<Props> {
  render() {
    const { referrals, classes } = this.props

    let hasReferrals = referrals && referrals.length !== 0
    return (
      <div className={classes.container}>
        <VeggieName>Who you referred</VeggieName>
        {!hasReferrals && <AppBody>No one has entered your code yet. Send it to your friends now!</AppBody>}
        {hasReferrals && referrals && referrals.map(x => <ReferralItem referral={x} />)}
      </div>
    )
  }
}

export const ReferralList = withStyles(styles)(_ReferralList)
