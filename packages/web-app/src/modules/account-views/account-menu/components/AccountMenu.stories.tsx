import { action } from '@storybook/addon-actions'
import type { Meta } from '@storybook/react'
import { AccountMenu } from '.'

export default {
  title: 'Modules/Account/AccountMenu/components/Account Menu',
  component: AccountMenu,
} as Meta

export const Complete = () => (
  <AccountMenu
    authenticated
    canLogin
    currentBalance={12.345}
    onClick={action('click')}
    onLogin={action('login')}
    username={'SaladB0B'}
  />
)

export const Empty = () => <AccountMenu authenticated canLogin onClick={action('click')} onLogin={action('login')} />

export const UsernameOnly = () => (
  <AccountMenu authenticated canLogin onClick={action('click')} onLogin={action('login')} username={'SaladB0B'} />
)

export const BalanceOnly = () => (
  <AccountMenu authenticated canLogin currentBalance={12345.678} onClick={action('click')} onLogin={action('login')} />
)

export const ZeroBalance = () => (
  <AccountMenu
    authenticated
    canLogin
    currentBalance={0}
    onClick={action('click')}
    onLogin={action('login')}
    username={'SaladB0B'}
  />
)

export const LongUsername = () => (
  <AccountMenu
    authenticated
    canLogin
    currentBalance={1234567890.123}
    onClick={action('click')}
    onLogin={action('login')}
    username={'SaladB0B has a long username, can cause issues because it is too long!'}
  />
)
