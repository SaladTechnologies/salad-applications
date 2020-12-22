import { Component } from 'react'
import Scrollbars from 'react-custom-scrollbars'
import withStyles, { WithStyles } from 'react-jss'
import { P, SectionHeader } from '../../../../components'
import { Referral } from '../../../referral/models'
import { ReferralItem } from './ReferralItem'

const styles = {
  container: {
    padding: 20,
    height: '100%',
  },
  content: {
    // padding: 20,
    paddingBottom: 50,
  },
}

interface Props extends WithStyles<typeof styles> {
  referrals?: Referral[]
}

class _ReferralList extends Component<Props> {
  render() {
    const { referrals, classes } = this.props

    let hasReferrals = referrals && referrals.length !== 0
    return (
      <div className={classes.container}>
        <SectionHeader>Who you referred</SectionHeader>
        {!hasReferrals && <P>No one has entered your code yet. Send it to your friends now!</P>}
        {hasReferrals && (
          <Scrollbars>
            <div className={classes.content}>{referrals && referrals.map((x) => <ReferralItem referral={x} />)}</div>
          </Scrollbars>
        )}
      </div>
    )
  }
}

export const ReferralList = withStyles(styles)(_ReferralList)
