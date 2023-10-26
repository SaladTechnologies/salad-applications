import { useFetchNotifications, useNotifications } from '@novu/notification-center'
import { NavigationBar, type NavigationBarProps } from '@saladtechnologies/garden-components'
import type { FunctionComponent } from 'react'
import { useEffect, useState } from 'react'
import { FeatureFlags, useFeatureManager } from '../../../FeatureManager'
import { getConfiguredNovuBannerNotifications } from '../../notifications/utils'

export const NavigationBarWithNovuNotifications: FunctionComponent<NavigationBarProps> = (props) => {
  const novu = useNotifications()
  const fetchNotificationsData = useFetchNotifications({ query: { read: false, limit: 10 } })
  const fetchNotificationsPageData = fetchNotificationsData.data?.pages[0]
  const unreadNovuNotifications = fetchNotificationsPageData?.data
  const [isDrawerOpened, setIsDrawerOpened] = useState(false)
  const markFetchedNotificationsAsSeen = novu?.markFetchedNotificationsAsSeen
  const featureManager = useFeatureManager()
  const isAchievementsFeatureFlagEnabled = featureManager.isEnabled(FeatureFlags.Achievements)

  useEffect(() => {
    const hasUnseenNotification = unreadNovuNotifications?.some((novuNotification) => !novuNotification.seen)
    if (isDrawerOpened && hasUnseenNotification) {
      markFetchedNotificationsAsSeen?.()
    }
  }, [markFetchedNotificationsAsSeen, unreadNovuNotifications, isDrawerOpened])

  const bannerNotifications = getConfiguredNovuBannerNotifications(unreadNovuNotifications, (notificationId: string) =>
    novu?.markNotificationAsRead(notificationId),
  )

  const achievementNotifications = isAchievementsFeatureFlagEnabled
    ? bannerNotifications.filter((notification) => notification?.variant === 'achievement')
    : []
  const newsNotifications = bannerNotifications.filter((notification) => notification?.variant === 'news')
  const warningsNotifications = bannerNotifications.filter((notification) => notification?.variant === 'error')
  const hasUnseenNotifications = novu?.unseenCount > 0
  const handleOpenNotificationsDrawer = () => {
    setIsDrawerOpened(true)
    props.notifications.onOpenNotificationsDrawer()

    if (hasUnseenNotifications) {
      markFetchedNotificationsAsSeen?.()
    }
  }
  const handleCloseNotificationsDrawer = () => {
    setIsDrawerOpened(false)

    props.notifications.onCloseNotificationsDrawer()
  }

  const notifications = {
    ...props.notifications,
    news: newsNotifications,
    warnings: warningsNotifications,
    achievements: achievementNotifications,
    hasUnseenNotifications,
    onOpenNotificationsDrawer: handleOpenNotificationsDrawer,
    onCloseNotificationsDrawer: handleCloseNotificationsDrawer,
  }

  return <NavigationBar {...props} notifications={notifications} />
}
