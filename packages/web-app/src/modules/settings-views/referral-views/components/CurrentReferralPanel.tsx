import React, { Component } from 'react'
import { SaladTheme } from '../../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { Referral } from '../../../referral/models'
import { CurrentReferralProgress } from './CurrentReferralProgress'
import classnames from 'classnames'
import { VeggieName, P } from '../../../../components'
import { ReferralCodeEntryComponent } from './ReferralCodeEntryComponent'

const styles = (theme: SaladTheme) => ({
  container: {
    userSelect: 'none',
    paddingBottom: '1rem',
  },
})

interface Props extends WithStyles<typeof styles> {
  referral?: Referral
  submitting?: boolean
  onSubmitCode?: (code: string) => void
  errorMessage?: string
}

class _CurrentReferralPanel extends Component<Props> {
  render() {
    const { referral, classes, ...rest } = this.props
    return (
      <>
        {referral && <CurrentReferralProgress referral={referral} />}
        {!referral && (
          <div className={classnames(classes.container)}>
            <VeggieName>Enter A Code</VeggieName>
            <P>Receive a referral code? Enter it below so you can earn your referral bonus!.</P>
            <ReferralCodeEntryComponent {...rest} />
          </div>
        )}
      </>
    )
  }
}

export const CurrentReferralPanel = withStyles(styles)(_CurrentReferralPanel)
