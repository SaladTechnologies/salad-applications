import React, { Component } from 'react'
import { SaladTheme } from '../../../SaladTheme'
import withStyles, { WithStyles } from 'react-jss'
import classnames from 'classnames'
import { VeggieName, AppBody } from '../../../components'
import { ReferralCodeEntryComponent } from './ReferralCodeEntryComponent'

const styles = (theme: SaladTheme) => ({
  container: {
    userSelect: 'none',
    paddingBottom: '1rem',
  },
})

interface Props extends WithStyles<typeof styles> {
  submitting?: boolean
  onSubmitCode?: (code: string) => void
  errorMessage?: string
}

class _CurrentReferralEntry extends Component<Props> {
  render() {
    const { classes, ...rest } = this.props
    return (
      <div className={classnames(classes.container)}>
        <VeggieName>Enter A Code</VeggieName>
        <AppBody>Receive a referral code? Enter it below so you can earn your referral bonus!.</AppBody>
        <ReferralCodeEntryComponent {...rest} />
      </div>
    )
  }
}

export const CurrentReferralEntry = withStyles(styles)(_CurrentReferralEntry)
