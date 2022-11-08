import { storiesOf } from '@storybook/react'
import { MustUpdateNotificationBanner } from './MustUpdateNotificationBanner'

storiesOf('Components/Should Update Notification Banner', module).add('default', () => {
  return <MustUpdateNotificationBanner />
})
