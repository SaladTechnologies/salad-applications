import React from 'react'
import { action } from '@storybook/addon-actions'
import { LoginPanel } from './LoginPanel'

export default {
  title: 'Modules/Auth/components/Login Panel',
  component: LoginPanel,
}

export const Default = () => (
  <LoginPanel authenticated={false} onLogin={action('login')} onRegister={action('register')} />
)

export const CustomText = () => (
  <LoginPanel
    authenticated={false}
    onLogin={action('login')}
    onRegister={action('register')}
    text="Hello, is this thing on??"
  />
)

export const Authenticated = () => (
  <LoginPanel authenticated={true} onLogin={action('login')} onRegister={action('register')} />
)
