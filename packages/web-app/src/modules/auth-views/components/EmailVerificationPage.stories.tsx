import { action } from '@storybook/addon-actions'
import React from 'react'
import { EmailVerificationPage } from './EmailVerificationPage'

export default {
  title: 'Modules/Profile/Email Verification Page',
  component: EmailVerificationPage,
}

export const Blank = () => (
  <EmailVerificationPage onResendVerificationEmail={action('resend')} onLogout={action('go back')} />
)

export const SendStatus = () => (
  <EmailVerificationPage
    status="Sending now"
    onResendVerificationEmail={action('resend')}
    onLogout={action('go back')}
  />
)

export const WithEmail = () => (
  <EmailVerificationPage
    emailAddress="dev@salad.io"
    onResendVerificationEmail={action('resend')}
    onLogout={action('go back')}
  />
)
