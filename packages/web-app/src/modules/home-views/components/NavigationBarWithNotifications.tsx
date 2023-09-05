import { useNotifications } from '@novu/notification-center'
import { NavigationBar, type NavigationBarProps } from '@saladtechnologies/garden-components'
import type { FunctionComponent } from 'react'
import { getConfiguredNovuBannerNotifications } from '../../notifications/utils'

export const NavigationBarWithNotifications: FunctionComponent<NavigationBarProps> = (props) => {
  const novu = useNotifications()
  const novuNotifications = novu?.notifications || []

  const unreadNovuNotifications = novuNotifications?.filter((notification) => !notification.read)
  const bannerNotifications = getConfiguredNovuBannerNotifications(unreadNovuNotifications, (notificationId: string) =>
    novu?.markNotificationAsRead(notificationId),
  )
  const newsNotifications = bannerNotifications.filter((notification) => notification?.variant === 'news')
  const warningsNotifications = bannerNotifications.filter((notification) => notification?.variant === 'error')
  const hasUnseenNotifications = novu?.unseenCount > 0
  const handleOpenNotificationsDrawer = () => {
    props.notifications.onOpenNotificationsDrawer()

    if (hasUnseenNotifications) {
      novu?.markAllNotificationsAsSeen()
    }
  }

  const notifications = {
    ...props.notifications,
    news: newsNotifications,
    warnings: warningsNotifications,
    hasUnseenNotifications,
    onOpenNotificationsDrawer: handleOpenNotificationsDrawer,
  }

  return <NavigationBar {...props} notifications={notifications} />
}
