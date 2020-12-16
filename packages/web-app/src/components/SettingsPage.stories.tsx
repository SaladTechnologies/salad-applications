import { action } from '@storybook/addon-actions'
import { Meta } from '@storybook/react'
import React from 'react'
import { MenuItem, SettingsPage } from './SettingsPage'

export default {
  title: 'Components/Settings Page',
  component: SettingsPage,
} as Meta

const menuItems: MenuItem[] = [
  { url: '/settings/summary', text: 'Page 1', component: () => <div>Page 1</div> },
  { url: '/settings/referrals', text: 'Page 2', component: () => <div>Page 2</div> },
  { url: '/settings/reward-vault', text: 'Page 3', component: () => <div>Page 3</div> },
]

export const Default = () => <SettingsPage menuItems={menuItems} />
export const WithBack = () => <SettingsPage menuItems={menuItems} onClose={action('back')} />
