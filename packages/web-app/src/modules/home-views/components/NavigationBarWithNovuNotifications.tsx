import type { IMessageId } from '@novu/notification-center'
import { useFetchNotifications, useMarkNotificationsAs } from '@novu/notification-center'
import { NavigationBar, type NavigationBarProps } from '@saladtechnologies/garden-components'
import type { FunctionComponent } from 'react'
import { useCallback, useEffect, useMemo } from 'react'
import { FeatureFlags, useFeatureManager } from '../../../FeatureManager'
import { getConfiguredNovuBannerNotifications } from '../../notifications/utils'

export const NavigationBarWithNovuNotifications: FunctionComponent<NavigationBarProps> = (props) => {
  const {
    isNotificationsDrawerOpened,
    onOpenNotificationsDrawer,
    onCloseNotificationsDrawer,
    handleDismissAllNews,
    handleDismissAllWarnings,
  } = props.notifications

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

  const unseenNewsNotificationIds = useMemo(() => {
    if (!unreadNovuNotificationsWithoutStarChef) return []

    // Get all banner notifications to establish the mapping
    const allBannerNotifications = getConfiguredNovuBannerNotifications(
      unreadNovuNotificationsWithoutStarChef,
      () => {}, // Empty callback since we only need the mapping
    )

    // Filter original notifications that correspond to 'news' variant banners
    const newsNotificationIndexes = allBannerNotifications
      .map((notification, index) => (notification?.variant === 'news' ? index : -1))
      .filter((index) => index !== -1)

    // Get the IDs from the original notifications at those indexes
    const newsNotificationIds = newsNotificationIndexes
      .map((index) => unreadNovuNotificationsWithoutStarChef[index]?._id)
      .filter(Boolean)

    // Filter unseenNovuNotificationsIds to only include news notification IDs
    return unseenNovuNotificationsIds?.filter((id) => newsNotificationIds.includes(id)) || []
  }, [unreadNovuNotificationsWithoutStarChef, unseenNovuNotificationsIds])

  // Similarly for warnings:
  const unseenWarningsNotificationIds = useMemo(() => {
    if (!unreadNovuNotificationsWithoutStarChef) return []

    const allBannerNotifications = getConfiguredNovuBannerNotifications(
      unreadNovuNotificationsWithoutStarChef,
      () => {},
    )

    const warningsNotificationIndexes = allBannerNotifications
      .map((notification, index) => (notification?.variant === 'error' ? index : -1))
      .filter((index) => index !== -1)

    const warningsNotificationIds = warningsNotificationIndexes
      .map((index) => unreadNovuNotificationsWithoutStarChef[index]?._id)
      .filter(Boolean)

    return unseenNovuNotificationsIds?.filter((id) => warningsNotificationIds.includes(id)) || []
  }, [unreadNovuNotificationsWithoutStarChef, unseenNovuNotificationsIds])

  const handleDismissAllNewsCallback = useCallback(() => {
    if (unseenNewsNotificationIds && unseenNewsNotificationIds.length > 0) {
      markNotificationsAs({
        messageId: unseenNewsNotificationIds,
        seen: true,
        read: true,
      })
    }
  }, [markNotificationsAs, unseenNewsNotificationIds])

  const handleDismissAllWarningsCallback = useCallback(() => {
    if (unseenWarningsNotificationIds && unseenWarningsNotificationIds.length > 0) {
      markNotificationsAs({
        messageId: unseenWarningsNotificationIds,
        seen: true,
        read: true,
      })
    }
  }, [markNotificationsAs, unseenWarningsNotificationIds])

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
