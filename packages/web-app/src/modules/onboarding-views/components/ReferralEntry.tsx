import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import classnames from 'classnames'
import image from '../assets/Home - How it Works.svg'
import { OnboardingPage } from './OnboardingPage'

const styles = (theme: SaladTheme) => ({
  container: {},
})

interface Props extends WithStyles<typeof styles> {
  onNext?: () => void
}

class _ReferralEntry extends Component<Props> {
  render() {
    const { onNext, classes } = this.props

    return (
      <OnboardingPage
        title={'Referral Code Entry'}
        subtitle={'Referred by a friend? Enter your code below so you can earn your referral bonus!'}
        image={image}
        onNext={onNext}
      />
    )
  }
}

export const ReferralEntry = withStyles(styles)(_ReferralEntry)
