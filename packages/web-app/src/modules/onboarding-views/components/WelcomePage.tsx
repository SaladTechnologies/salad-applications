import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import image from '../assets/Welcome.svg'
import { OnboardingPage } from '../../../components'

const styles = ({
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
        subtitle={`Your computer does the work, and you get paid. 
        You can earn great loot like Steam credit, gift cards, game 
        codes and more. Just let Salad run when you're not using your rig.`}
        image={image}
        nextSubmitting={submitting}
        nextText={'Login'}
        onNext={onNext}
        fullHeightImg
      />
    )
  }
}

export const WelcomePage = withStyles(styles)(_WelcomePage)
