import { action } from '@storybook/addon-actions'
import type { Meta } from '@storybook/react'
import { LoginPanel } from './LoginPanel'

export default {
  title: 'Modules/Auth/components/Login Panel',
  component: LoginPanel,
} as Meta

export const Default = () => (
  <LoginPanel authenticated={false} canLogin onLogin={action('login')} onRegister={action('register')} />
)

export const CustomText = () => (
  <LoginPanel
    authenticated={false}
    canLogin
    onLogin={action('login')}
    onRegister={action('register')}
    text="Hello, is this thing on??"
  />
)

export const Authenticated = () => (
  <LoginPanel authenticated={true} canLogin onLogin={action('login')} onRegister={action('register')} />
)
