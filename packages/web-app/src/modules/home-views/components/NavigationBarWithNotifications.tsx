import { NavigationBar, type NavigationBarProps } from '@saladtechnologies/garden-components'
import type { AccountNavigationMenuItem } from '@saladtechnologies/garden-components/lib/components/NavigationBar/components/DesktopNavigationBar/AccountNavigationMenu'
import type { FunctionComponent } from 'react'
import { FeatureFlags, useFeatureManager } from '../../../FeatureManager'
import { InstallReminder } from './InstallReminder'

export interface NavigationBarWithNotificationsProps extends NavigationBarProps {
  withInstallReminder: boolean
  isUserReferralsEnabled: boolean
  onCloseInstallReminderClick: () => void
}

export const NavigationBarWithNotifications: FunctionComponent<NavigationBarWithNotificationsProps> = ({
  withInstallReminder,
  isUserReferralsEnabled,
  onCloseInstallReminderClick,
  ...props
}) => {
  const featureManager = useFeatureManager()
  const isAchievementsFeatureFlagEnabled = featureManager.isEnabled(FeatureFlags.Achievements)
  const isDemandNotificationsFeatureFlagEnabled = featureManager.isEnabled(FeatureFlags.DemandNotifications)

  const accountNavigationMenuitems = [
    {
      title: 'Account',
      url: '/account/summary',
      links: [
        {
          label: 'Profile',
          link: '/account/summary',
        },
        isUserReferralsEnabled && {
          label: 'Referrals',
          link: '/account/referrals',
        },
        {
          label: 'Bonuses',
          link: '/account/bonuses',
        },
        isAchievementsFeatureFlagEnabled && {
          label: 'Achievements',
          link: '/account/achievements',
        },
        isDemandNotificationsFeatureFlagEnabled && {
          label: 'Demand Alerts',
          link: '/account/alerts',
        },
        {
          label: 'Logout',
          link: '/',
          logout: true,
        },
      ].filter((menuItem) => !!menuItem),
    },
  ] as AccountNavigationMenuItem[]

  const notifications = {
    ...props.notifications,
    news: props.notifications.news ?? [],
    warnings: props.notifications.warnings ?? [],
    achievements: props.notifications.achievements ?? [],
    hasUnseenNotifications: props.notifications.hasUnseenNotifications ?? false,
    onOpenNotificationsDrawer: props.notifications.onOpenNotificationsDrawer,
    onCloseNotificationsDrawer: props.notifications.onCloseNotificationsDrawer,
  }

  const isNewChefDownloadFeatureFlagEnabled = featureManager.isEnabled(FeatureFlags.NewChefDownload)
  const headerBannerContent =
    withInstallReminder && isNewChefDownloadFeatureFlagEnabled ? (
      <InstallReminder onCloseClick={onCloseInstallReminderClick} />
    ) : undefined

  return (
    <NavigationBar
      {...props}
      notifications={notifications}
      accountNavigationMenuitems={accountNavigationMenuitems}
      headerBannerContent={headerBannerContent}
    />
  )
}
