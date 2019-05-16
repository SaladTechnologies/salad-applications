import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { BottomBar } from './BottomBar'
import { Titlebar } from './Titlebar'
import { OfflineModal } from './OfflineModal'
import { NotificationBanner } from './NotificationBanner'

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
  .add('Notification Banner', () => {
    let duration = 20 * 60000 // 20 minutes
    let start = new Date()
    let end = new Date(start.getTime() + duration)
    let text = '2X Earnings Week: May 16 - May 22'
    return (
      <>
        <div>
          Before time
          <NotificationBanner now={new Date(start.getTime() - duration)} startDate={start} endDate={end} text={text} />
        </div>
        <div>
          During
          <NotificationBanner
            now={new Date(start.getTime() + duration / 2)}
            startDate={start}
            endDate={end}
            text={text}
          />
        </div>
        <div>
          After
          <NotificationBanner
            now={new Date(start.getTime() + duration * 2)}
            startDate={start}
            endDate={end}
            text={text}
          />
        </div>
      </>
    )
  })
  .add('Offline Modal', () => {
    return <OfflineModal />
  })
