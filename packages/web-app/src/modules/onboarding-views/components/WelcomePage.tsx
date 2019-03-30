import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import image from '../assets/Home - How it Works.svg'
import { OnboardingPage } from '../../../components'

const styles = (theme: SaladTheme) => ({
  container: {},
})

interface Props extends WithStyles<typeof styles> {
  onNext?: () => void
  submitting?: boolean
}

class _WelcomePage extends Component<Props> {
  render() {
    const { submitting, onNext } = this.props
    return (
      <OnboardingPage
        title={'Welcome to Salad'}
        subtitle={'The only place you can earn amazing rewards for doing nothing!'}
        image={image}
        nextSubmitting={submitting}
        nextText={'Login'}
        onNext={onNext}
      />
    )
  }
}

export const WelcomePage = withStyles(styles)(_WelcomePage)
