import { useNotifications } from '@novu/notification-center'
import { NavigationBar, type NavigationBarProps } from '@saladtechnologies/garden-components'
import type { FunctionComponent } from 'react'
import { getConfiguredNovuBannerNotifications } from '../../notifications/utils'

export const NavigationBarWithNotifications: FunctionComponent<NavigationBarProps> = (props) => {
  const { notifications: novuNotifications, unseenCount } = useNotifications()

  // TODO: Provide actions logic
  const bannerNotifications = getConfiguredNovuBannerNotifications(
    novuNotifications,
    () => {
      console.log('onAcknowledge')
    },
    () => {
      console.log('onDismiss')
    },
    () => {
      console.log('onReadNovuNotifications')
    },
  )
  const newsNotifications = bannerNotifications.filter((notification) => notification?.variant === 'news')
  const warningsNotifications = bannerNotifications.filter((notification) => notification?.variant === 'error')
  const notifications = {
    ...props.notifications,
    news: newsNotifications,
    warnings: warningsNotifications,
    hasUnseenNotifications: unseenCount > 0,
  }

  return <NavigationBar {...props} notifications={notifications} />
}
