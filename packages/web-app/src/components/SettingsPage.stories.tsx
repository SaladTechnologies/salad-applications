import React from 'react'
import { storiesOf } from '@storybook/react'
// import { action } from '@storybook/addon-actions'
import { SettingsPage } from './SettingsPage'

storiesOf('SettingsPage', module).add('SettingsPage', () => {
  // return <Settings onCloseClicked={action('close')}>Hello!</Settings>
  return <SettingsPage>Hello!</SettingsPage>
})
