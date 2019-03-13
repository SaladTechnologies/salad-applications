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
  onNext?: () => void
  onToggleAnalytics?: () => void
  analyticsEnabled?: boolean
}

class _AnalyticsPage extends Component<Props> {
  render() {
    const { onToggleAnalytics, analyticsEnabled, onNext } = this.props
    return (
      <OnboardingPage
        title={'App usage information'}
        subtitle={'Help the Salad Chefs improve the experience by sharing how you use Salad.'}
        image={image}
        nextText={'Next'}
        onNext={onNext}
      >
        <div>
          <Checkbox checked={analyticsEnabled} onClick={onToggleAnalytics} text={'Share app usage with Salad'} />
        </div>
      </OnboardingPage>
    )
  }
}

export const AnalyticsPage = withStyles(styles)(_AnalyticsPage)
