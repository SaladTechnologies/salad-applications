import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { BottomBar } from './BottomBar'
import { Titlebar } from './Titlebar'
import { OfflineModal } from './OfflineModal'

storiesOf('Modules/Home', module)
  .add('Bottom Bar', () => {
    return (
      <BottomBar
        version={'1.2.3'}
        onVersionClick={action('version')}
        onDiscordClick={action('discord')}
        onSupportClick={action('support')}
      />
    )
  })
  .add('Title Bar', () => {
    return (
      <>
        With actions
        <Titlebar showWindowActions />
        Without actions
        <Titlebar />
      </>
    )
  })
  .add('Offline Modal', () => {
    return <OfflineModal />
  })
