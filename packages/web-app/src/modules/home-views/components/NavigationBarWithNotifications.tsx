import { NavigationBar, type NavigationBarProps } from '@saladtechnologies/garden-components'
import type { FunctionComponent } from 'react'
import { NavigationBarWithNovuNotifications } from './NavigationBarWithNovuNotifications'

export const NavigationBarWithNotifications: FunctionComponent<NavigationBarProps> = (props) => {
  const notifications = {
    ...props.notifications,
    news: [],
    warnings: [],
    hasUnseenNotifications: false,
    onOpenNotificationsDrawer: props.notifications.onOpenNotificationsDrawer,
    onCloseNotificationsDrawer: props.notifications.onCloseNotificationsDrawer,
  }

  return props.username !== undefined ? (
    <NavigationBarWithNovuNotifications {...props} />
  ) : (
    <NavigationBar {...props} notifications={notifications} />
  )
}
