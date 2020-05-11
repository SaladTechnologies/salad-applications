import { action } from '@storybook/addon-actions'
import React from 'react'
import { EmailVerificationPage } from './EmailVerificationPage'

export default {
  title: 'Modules/Profile/Email Verification Page',
  component: EmailVerificationPage,
}

export const Blank = () => (
  <EmailVerificationPage resendVerificationEmail={action('resend')} goBack={action('go back')} />
)

export const SendStatus = () => (
  <EmailVerificationPage
    sendStatus="Sending now"
    resendVerificationEmail={action('resend')}
    goBack={action('go back')}
  />
)

export const WithEmail = () => (
  <EmailVerificationPage
    emailAddress="dev@salad.io"
    resendVerificationEmail={action('resend')}
    goBack={action('go back')}
  />
)
