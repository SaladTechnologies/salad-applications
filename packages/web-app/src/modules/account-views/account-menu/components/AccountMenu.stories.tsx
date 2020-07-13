import React from 'react'
import { AccountMenu } from '.'
import { action } from '@storybook/addon-actions'

export default {
  title: 'Modules/Account/Account Menu',
  component: AccountMenu,
}

export const Complete = () => <AccountMenu username={'SaladB0B'} currentBalance={12.345} onClick={action('click')} />
export const Empty = () => <AccountMenu onClick={action('click')} />
export const UsernameOnly = () => <AccountMenu username={'SaladB0B'} onClick={action('click')} />
export const BalanceOnly = () => <AccountMenu currentBalance={12345.678} onClick={action('click')} />
export const ZeroBalance = () => <AccountMenu username={'SaladB0B'} currentBalance={0} onClick={action('click')} />
export const LongUsername = () => (
  <AccountMenu
    username={'SaladB0B has a long username, can cause issues because it is too long!'}
    currentBalance={1234567890.123}
    onClick={action('click')}
  />
)
