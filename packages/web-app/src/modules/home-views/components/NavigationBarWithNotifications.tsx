import { NavigationBar, type NavigationBarProps } from '@saladtechnologies/garden-components'
import type { FunctionComponent } from 'react'
import { NavigationBarWithNovuNotifications } from './NavigationBarWithNovuNotifications'

export interface NavigationBarWithNotificationsProps extends NavigationBarProps {
  novuSignature?: string
}

export const NavigationBarWithNotifications: FunctionComponent<NavigationBarWithNotificationsProps> = ({
  novuSignature,
  ...props
}) => {
  const notifications = {
    ...props.notifications,
    news: [],
    warnings: [],
    hasUnseenNotifications: false,
    onOpenNotificationsDrawer: props.notifications.onOpenNotificationsDrawer,
    onCloseNotificationsDrawer: props.notifications.onCloseNotificationsDrawer,
  }
  const shouldShowNavigationBarWithNovuNotifications = props.username !== undefined && novuSignature !== undefined

  return shouldShowNavigationBarWithNovuNotifications ? (
    <NavigationBarWithNovuNotifications {...props} />
  ) : (
    <NavigationBar {...props} notifications={notifications} />
  )
}
