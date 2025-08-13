import type { IMessageId } from '@novu/notification-center'
import { useFetchNotifications, useMarkNotificationsAs } from '@novu/notification-center'
import { NavigationBar, type NavigationBarProps } from '@saladtechnologies/garden-components'
import type { FunctionComponent } from 'react'
import { useCallback, useEffect, useMemo } from 'react'
import { FeatureFlags, useFeatureManager } from '../../../FeatureManager'
import { getConfiguredNovuBannerNotifications } from '../../notifications/utils'

export const NavigationBarWithNovuNotifications: FunctionComponent<NavigationBarProps> = (props) => {
  const { isNotificationsDrawerOpened, onOpenNotificationsDrawer, onCloseNotificationsDrawer } = props.notifications

  const featureManager = useFeatureManager()
  const isAchievementsFeatureFlagEnabled = featureManager.isEnabled(FeatureFlags.Achievements)

  const fetchNotificationsData = useFetchNotifications({ query: { read: false, limit: 10 } })
  const fetchNotificationsPageData = fetchNotificationsData.data?.pages[0]
  const unreadNovuNotifications = fetchNotificationsPageData?.data
  const unreadNovuNotificationsWithoutStarChef = useMemo(
    () => unreadNovuNotifications?.filter((unreadNovuNotification) => !unreadNovuNotification.payload?.starChefStatus),
    [unreadNovuNotifications],
  )

  const unseenNovuNotificationsIds = useMemo(
    () =>
      unreadNovuNotificationsWithoutStarChef
        ?.filter((unreadNovuNotificationWithoutStarChef) => !unreadNovuNotificationWithoutStarChef.seen)
        .map((unseenNovuNotification) => unseenNovuNotification._id),
    [unreadNovuNotificationsWithoutStarChef],
  )
  const hasUnseenNotifications = !!unseenNovuNotificationsIds?.length

  const { markNotificationsAs } = useMarkNotificationsAs()
  const handleMarkNotificationAs = useCallback(
    (messageId: IMessageId, seen: boolean, read: boolean) => {
      markNotificationsAs({
        messageId,
        seen,
        read,
      })
    },
    [markNotificationsAs],
  )

  useEffect(() => {
    if (isNotificationsDrawerOpened && hasUnseenNotifications) {
      handleMarkNotificationAs(unseenNovuNotificationsIds, true, false)
    }
  }, [isNotificationsDrawerOpened, handleMarkNotificationAs, unseenNovuNotificationsIds, hasUnseenNotifications])

  const bannerNotifications = getConfiguredNovuBannerNotifications(
    unreadNovuNotificationsWithoutStarChef,
    (notificationId: string) => handleMarkNotificationAs(notificationId, true, true),
  )

  const achievementNotifications = isAchievementsFeatureFlagEnabled
    ? bannerNotifications.filter((notification) => notification?.variant === 'achievement')
    : []
  const newsNotifications = bannerNotifications.filter((notification) => notification?.variant === 'news')
  const warningsNotifications = bannerNotifications.filter((notification) => notification?.variant === 'error')

  const handleDismissAllNewsCallback = useCallback(() => {
    if (newsNotifications && newsNotifications.length > 0) {
      newsNotifications.forEach((notification) => {
        if (notification.onClose) {
          notification.onClose()
        }
      })
    }
  }, [newsNotifications])

  const handleDismissAllWarningsCallback = useCallback(() => {
    if (warningsNotifications && warningsNotifications.length > 0) {
      warningsNotifications.forEach((notification) => {
        if (notification.onClose) {
          notification.onClose()
        }
      })
    }
  }, [warningsNotifications])

  const notifications = {
    ...props.notifications,
    news: newsNotifications,
    warnings: warningsNotifications,
    achievements: achievementNotifications,
    hasUnseenNotifications,
    onOpenNotificationsDrawer,
    onCloseNotificationsDrawer,
    handleDismissAllNews: handleDismissAllNewsCallback,
    handleDismissAllWarnings: handleDismissAllWarningsCallback,
  }

  return <NavigationBar {...props} notifications={notifications} />
}
