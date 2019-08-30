import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import { Referral } from '../../referral/models'
import { CurrentReferralProgress } from './CurrentReferralProgress'
import { CurrentReferralEntry } from './CurrentReferralEntry'

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
        {!referral && <CurrentReferralEntry {...rest} />}
      </>
    )
  }
}

export const CurrentReferralPanel = withStyles(styles)(_CurrentReferralPanel)
