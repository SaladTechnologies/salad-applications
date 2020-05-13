import React from 'react'
import { SettingsButton } from './SettingsButton'

export default {
  title: 'Modules/Settings/components/Settings Button',
  component: SettingsButton,
}

export const Latest = () => <SettingsButton onLatestDesktop={true} />
export const NotLatest = () => <SettingsButton onLatestDesktop={false} />
