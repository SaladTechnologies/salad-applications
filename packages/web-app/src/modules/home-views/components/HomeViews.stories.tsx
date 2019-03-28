import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { BottomBar } from './BottomBar'
import { MenuBar, MenuItem } from './MenuBar'
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
  .add('Menu Bar', () => {
    const items: MenuItem[] = [new MenuItem('Account', action('account')), new MenuItem('Settings', action('settings'))]
    return <MenuBar menuItems={items} />
  })
  .add('Title Bar', () => {
    return <Titlebar />
  })
  .add('Offline Modal', () => {
    return <OfflineModal />
  })
