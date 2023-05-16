import { useNotifications } from '@novu/notification-center'
import { NavigationBar as GardenNovigationBar, type NavigationBarProps } from '@saladtechnologies/garden-components'
import type { FunctionComponent } from 'react'
import { getConfiguredNovuBannerNotifications } from '../../notifications/utils'

export const NavigationBar: FunctionComponent<NavigationBarProps> = (props) => {
  const { notifications: novuNotifications, unseenCount } = useNotifications()

  // TODO: Provide actions logic
  const bannerNotifications = getConfiguredNovuBannerNotifications(
    novuNotifications,
    () => {console.log("onAcknowledge")},
    () => {console.log("onDismiss")},
    () => {console.log("onReadNovuNotifications")}
  )
  const newsNotifications = bannerNotifications.filter((notification) => notification?.variant === 'news')
  const warningsNotifications = bannerNotifications.filter((notification) => notification?.variant === 'error')
  const hasUnseenNotifications = unseenCount > 0
  const notifications: Pick<NavigationBarProps, 'notifications'> = {
    ...props.notifications,
    news: newsNotifications,
    warnings: warningsNotifications,
    hasUnseenNotifications
  }

  return <GardenNovigationBar {...props} notifications={notifications} />
}
