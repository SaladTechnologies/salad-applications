import React, { Component } from 'react'
import { SaladTheme } from '../../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { Referral } from '../../../referral/models'
import { ReferralItem } from './ReferralItem'
import { VeggieName, P } from '../../../../components'

const styles = (theme: SaladTheme) => ({
  container: {
    color: theme.darkBlue,
    height: '100%',
    width: '100%',
    overflow: 'auto',
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
        {!hasReferrals && <P>No one has entered your code yet. Send it to your friends now!</P>}
        {hasReferrals && referrals && referrals.map(x => <ReferralItem referral={x} />)}
      </div>
    )
  }
}

export const ReferralList = withStyles(styles)(_ReferralList)
