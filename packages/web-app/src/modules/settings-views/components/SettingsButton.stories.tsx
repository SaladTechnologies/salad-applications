import type { Meta } from '@storybook/react'
import { SettingsButton } from './SettingsButton'

export default {
  title: 'Modules/Settings/components/Settings Button',
  component: SettingsButton,
} as Meta

export const Latest = () => <SettingsButton onLatestDesktop={true} />
export const NotLatest = () => <SettingsButton onLatestDesktop={false} />
