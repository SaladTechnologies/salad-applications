import React from 'react'
import { storiesOf } from '@storybook/react'
import { OnboardingPage } from './OnboardingPage'
import howItWorks from '../assets/Home - How it Works.svg'
import { action } from '@storybook/addon-actions'
import { ReferralEntry } from './ReferralEntry'

storiesOf('Modules/Onboarding', module)
  .add('Onboarding Page', () => {
    return (
      <OnboardingPage
        title={'Title goes here'}
        subtitle={'Some kind of subhead could go here if it was required'}
        image={howItWorks}
        onNext={action('next')}
      />
    )
  })
  .add('Onboarding Page w/ Back', () => {
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
  .add('Onboarding Page w/ Next', () => {
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
  .add('Referral Entry', () => {
    return <ReferralEntry onSubmitCode={action('submit')} onNext={action('next')} />
  })
