import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { BottomBar } from './BottomBar'

storiesOf('Modules/Home', module).add('Bottom Bar', () => {
  return <BottomBar onDiscordClick={action('discord')} onSupportClick={action('support')} />
})
