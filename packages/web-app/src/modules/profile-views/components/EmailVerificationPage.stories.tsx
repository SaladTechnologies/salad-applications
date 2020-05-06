import React from 'react'
import { EmailVerificationPage } from './EmailVerificationPage'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Modules/Profile/Email Verification Page',
  component: EmailVerificationPage,
}

export const Blank = () => <EmailVerificationPage resendVerification={action('resend')} goBack={action('go back')} />
export const SendStatus = () => (
  <EmailVerificationPage sendStatus="Sending now" resendVerification={action('resend')} goBack={action('go back')} />
)
export const WithEmail = () => (
  <EmailVerificationPage emailAddress="dev@salad.io" resendVerification={action('resend')} goBack={action('go back')} />
)
