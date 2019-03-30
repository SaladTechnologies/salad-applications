import React from 'react'
import { storiesOf } from '@storybook/react'
import { OnboardingPage } from './OnboardingPage'
import { action } from '@storybook/addon-actions'
import howItWorks from '../../.storybook/assets/Home - How it Works.svg'

storiesOf('Components/Onboarding Page', module)
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
