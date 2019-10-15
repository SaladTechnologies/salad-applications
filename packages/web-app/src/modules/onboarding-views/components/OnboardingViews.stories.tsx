import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { ReferralEntryPage } from './ReferralEntryPage'
import { WelcomePage } from './WelcomePage'
import { TermsPage } from './TermsPage'
import { WhatsNewPage } from './WhatsNewPage'

storiesOf('Modules/Onboarding', module)
  .add('Referral Entry Page', () => {
    return <ReferralEntryPage onNext={action('next')} />
  })
  .add('Welcome Page', () => {
    return <WelcomePage onNext={action('login')} />
  })
  .add('Terms Page', () => {
    return <TermsPage onAgree={action('agree')} />
  })
  .add(`What's New Page`, () => {
    return <WhatsNewPage onNext={action('ok')} />
  })
