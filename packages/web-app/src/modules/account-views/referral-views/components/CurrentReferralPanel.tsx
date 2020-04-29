import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { Referral } from '../../../referral/models'
import { CurrentReferralProgress } from './CurrentReferralProgress'
import classnames from 'classnames'
import { P, SectionHeader } from '../../../../components'
import { ReferralCodeEntryComponent } from './ReferralCodeEntryComponent'

const styles = {
  container: {
    userSelect: 'none',
    paddingBottom: '1rem',
  },
}

interface Props extends WithStyles<typeof styles> {
  referral?: Referral

  onSubmitCode?: (code: string) => Promise<void>
}

class _CurrentReferralPanel extends Component<Props> {
  render() {
    const { referral, classes, ...rest } = this.props
    return (
      <>
        {referral && <CurrentReferralProgress referral={referral} />}
        {!referral && (
          <div className={classnames(classes.container)}>
            <SectionHeader>Enter A Code</SectionHeader>
            <P>Received a referral code? Enter it below so you can earn your referral bonus!</P>
            <ReferralCodeEntryComponent {...rest} />
          </div>
        )}
      </>
    )
  }
}

export const CurrentReferralPanel = withStyles(styles)(_CurrentReferralPanel)
