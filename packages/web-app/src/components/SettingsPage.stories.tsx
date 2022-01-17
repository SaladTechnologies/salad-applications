import { action } from '@storybook/addon-actions'
import { Meta } from '@storybook/react'
import { MenuItem, SettingsPage } from './SettingsPage'

export default {
  title: 'Components/Settings Page',
  component: SettingsPage,
} as Meta

const menuItems: MenuItem[] = [
  { url: '/account/summary', text: 'Page 1', component: () => <div>Page 1</div> },
  { url: '/account/referrals', text: 'Page 2', component: () => <div>Page 2</div> },
  { url: '/store/vault', text: 'Page 3', component: () => <div>Page 3</div> },
]

export const Default = () => <SettingsPage menuItems={menuItems} />
export const WithBack = () => <SettingsPage menuItems={menuItems} onClose={action('back')} />
