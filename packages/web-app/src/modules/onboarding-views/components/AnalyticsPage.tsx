import React, { Component } from 'react'
import withStyles, { WithStyles } from 'react-jss'
import { SaladTheme } from '../../../SaladTheme'
import image from '../assets/User-Data.svg'
import { OnboardingPage } from '../../../components'
import { Checkbox } from '../../../components'

const styles = (theme: SaladTheme) => ({
  container: {},
})

interface Props extends WithStyles<typeof styles> {
  onNext?: (agree: boolean) => void
  submitting?: boolean
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
    const { submitting } = this.props
    const { agree } = this.state
    return (
      <OnboardingPage
        title={'Making Salad Better'}
        subtitle={'We want Salad to be the best experience for you, so your input helps make things better.'}
        image={image}
        nextSubmitting={submitting}
        nextText={'Next'}
        onNext={this.handleNext}
      >
        <div>
          <Checkbox checked={agree} onClick={this.toggleAgree} text={'Allow analytics data to help Salad'} />
        </div>
      </OnboardingPage>
    )
  }
}

export const AnalyticsPage = withStyles(styles)(_AnalyticsPage)
