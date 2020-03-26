import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { WelcomePage } from './WelcomePage'
import { WhatsNewPage } from './WhatsNewPage'

storiesOf('Modules/Onboarding', module)
  .add('Welcome Page', () => {
    return <WelcomePage onNext={action('login')} />
  })
  .add(`What's New Page`, () => {
    return <WhatsNewPage onNext={action('ok')} />
  })
