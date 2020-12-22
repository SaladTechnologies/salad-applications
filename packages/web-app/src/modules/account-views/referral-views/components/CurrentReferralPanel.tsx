import classnames from 'classnames'
import { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { ReferralCodeEntryContainer } from '../..'
import { P, SectionHeader } from '../../../../components'
import { Referral } from '../../../referral/models'
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

class _CurrentReferralPanel extends Component<Props> {
  render() {
    const { referral, classes } = this.props
    return (
      <>
        {referral && <CurrentReferralProgress referral={referral} />}
        {!referral && (
          <div className={classnames(classes.container)}>
            <SectionHeader>Enter A Code</SectionHeader>
            <P>Received a referral code? Enter it below so you can earn your referral bonus!</P>
            <ReferralCodeEntryContainer />
          </div>
        )}
      </>
    )
  }
}

export const CurrentReferralPanel = withStyles(styles)(_CurrentReferralPanel)
