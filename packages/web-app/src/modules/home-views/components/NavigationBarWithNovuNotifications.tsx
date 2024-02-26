import type { IMessageId } from '@novu/notification-center'
import { useFetchNotifications, useMarkNotificationsAs } from '@novu/notification-center'
import { NavigationBar, type NavigationBarProps } from '@saladtechnologies/garden-components'
import type { FunctionComponent } from 'react'
import { useCallback, useEffect } from 'react'
import { FeatureFlags, useFeatureManager } from '../../../FeatureManager'
import { getConfiguredNovuBannerNotifications } from '../../notifications/utils'

export const NavigationBarWithNovuNotifications: FunctionComponent<NavigationBarProps> = (props) => {
  const { isNotificationsDrawerOpened, onOpenNotificationsDrawer, onCloseNotificationsDrawer } = props.notifications

  const featureManager = useFeatureManager()
  const isAchievementsFeatureFlagEnabled = featureManager.isEnabled(FeatureFlags.Achievements)

  const fetchNotificationsData = useFetchNotifications({ query: { read: false, limit: 10 } })
  const fetchNotificationsPageData = fetchNotificationsData.data?.pages[0]
  const unreadNovuNotifications = fetchNotificationsPageData?.data
  const unreadNovuNotificationsWithoutStarChef = unreadNovuNotifications?.filter(
    (unreadNovuNotification) => !unreadNovuNotification.payload?.starChefStatus,
  )
  const unseenNovuNotificationsIds = unreadNovuNotificationsWithoutStarChef
    ?.filter((unreadNovuNotificationWithoutStarChef) => !unreadNovuNotificationWithoutStarChef.seen)
    .map((unseenNovuNotification) => unseenNovuNotification._id)
  const unseenNovuNotificationsAmount = unseenNovuNotificationsIds?.length ?? 0

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
    if (isNotificationsDrawerOpened && unseenNovuNotificationsIds) {
      handleMarkNotificationAs(unseenNovuNotificationsIds, true, false)
    }
  }, [isNotificationsDrawerOpened, handleMarkNotificationAs, unseenNovuNotificationsIds])

  const bannerNotifications = getConfiguredNovuBannerNotifications(
    unreadNovuNotificationsWithoutStarChef,
    (notificationId: string) => handleMarkNotificationAs(notificationId, true, true),
  )

  const achievementNotifications = isAchievementsFeatureFlagEnabled
    ? bannerNotifications.filter((notification) => notification?.variant === 'achievement')
    : []
  const newsNotifications = bannerNotifications.filter((notification) => notification?.variant === 'news')
  const warningsNotifications = bannerNotifications.filter((notification) => notification?.variant === 'error')

  const handleOpenNotificationsDrawer = () => {
    onOpenNotificationsDrawer()

    if (unseenNovuNotificationsIds) {
      handleMarkNotificationAs(unseenNovuNotificationsIds, true, false)
    }
  }

  const notifications = {
    ...props.notifications,
    news: newsNotifications,
    warnings: warningsNotifications,
    achievements: achievementNotifications,
    hasUnseenNotifications: unseenNovuNotificationsAmount > 0,
    onOpenNotificationsDrawer: handleOpenNotificationsDrawer,
    onCloseNotificationsDrawer,
  }

  return <NavigationBar {...props} notifications={notifications} />
}
