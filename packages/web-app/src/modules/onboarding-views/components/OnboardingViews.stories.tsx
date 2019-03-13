import React from 'react'
import { storiesOf } from '@storybook/react'
import { OnboardingPage } from './OnboardingPage'
import howItWorks from '../assets/Home - How it Works.svg'
import { action } from '@storybook/addon-actions'
import { ReferralEntryPage } from './ReferralEntryPage'
import { WelcomePage } from './WelcomePage'
import { TermsPage } from './TermsPage'
import { AnalyticsPage } from './AnalyticsPage'

storiesOf('Modules|Onboarding/Base Page', module)
  .add('with image', () => {
    return (
      <OnboardingPage
        title={'Title goes here'}
        subtitle={'Some kind of subhead could go here if it was required'}
        image={howItWorks}
        onNext={action('next')}
      />
    )
  })
  .add('with content', () => {
    return (
      <OnboardingPage
        title={'Title goes here'}
        subtitle={'Some kind of subhead could go here if it was required'}
        rightContent={<div style={{ color: 'red', fontSize: '5rem' }}>Hello right side content</div>}
        onNext={action('next')}
      />
    )
  })
  .add('with back', () => {
    return (
      <OnboardingPage
        title={'Title goes here'}
        subtitle={'Some kind of subhead could go here if it was required'}
        image={howItWorks}
        hasBack
        onBack={action('back')}
        onNext={action('next')}
      />
    )
  })
  .add('with next', () => {
    return (
      <OnboardingPage
        title={'Title goes here'}
        subtitle={'Some kind of subhead could go here if it was required'}
        image={howItWorks}
        hasBack
        nextText="Skip for Now"
        onBack={action('back')}
        onNext={action('next')}
      />
    )
  })

storiesOf('Modules|Onboarding/Pages', module)
  .add('Referral Entry Page', () => {
    return <ReferralEntryPage onSubmitCode={action('submit')} onNext={action('next')} />
  })
  .add('Welcome Page', () => {
    return <WelcomePage onNext={action('login')} />
  })
  .add('Terms Page', () => {
    return <TermsPage onAgree={action('agree')} />
  })
  .add('Analytics Page', () => {
    return <AnalyticsPage onNext={action('next')} onToggleAnalytics={action('toggle story ')} analyticsEnabled={true} />
  })
