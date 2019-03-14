import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import image from '../assets/Home - How it Works.svg'
import { OnboardingPage } from './OnboardingPage'
import { Checkbox } from '../../../components'

const styles = (theme: SaladTheme) => ({
  container: {},
})

interface Props extends WithStyles<typeof styles> {
  onNext?: (agree: boolean) => void
}

interface State {
  agree: boolean
}

class _AnalyticsPage extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      agree: true,
    }
  }

  toggleAgree = () => {
    this.setState({
      agree: !this.state.agree,
    })
  }

  handleNext = () => {
    const { onNext } = this.props
    const { agree } = this.state

    if (onNext) {
      onNext(agree)
    }
  }
  render() {
    const { agree } = this.state
    return (
      <OnboardingPage
        title={'App usage information'}
        subtitle={'Help the Salad Chefs improve the experience by sharing how you use Salad.'}
        image={image}
        nextText={'Next'}
        onNext={this.handleNext}
      >
        <div>
          <Checkbox checked={agree} onClick={this.toggleAgree} text={'Share app usage with Salad'} />
        </div>
      </OnboardingPage>
    )
  }
}

export const AnalyticsPage = withStyles(styles)(_AnalyticsPage)
