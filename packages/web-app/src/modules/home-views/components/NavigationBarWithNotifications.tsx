import { NavigationBar, type NavigationBarProps } from '@saladtechnologies/garden-components'
import type { AccountNavigationMenuItem } from '@saladtechnologies/garden-components/lib/components/NavigationBar/components/DesktopNavigationBar/AccountNavigationMenu'
import type { FunctionComponent } from 'react'
import { FeatureFlags, useFeatureManager } from '../../../FeatureManager'
import { InstallReminder } from './InstallReminder'
import { NavigationBarWithNovuNotifications } from './NavigationBarWithNovuNotifications'

export interface NavigationBarWithNotificationsProps extends NavigationBarProps {
  novuSignature?: string
  withInstallReminder: boolean
  isUserReferralsEnabled: boolean
  onCloseInstallReminderClick: () => void
}

export const NavigationBarWithNotifications: FunctionComponent<NavigationBarWithNotificationsProps> = ({
  novuSignature,
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
    news: [],
    warnings: [],
    hasUnseenNotifications: false,
    onOpenNotificationsDrawer: props.notifications.onOpenNotificationsDrawer,
    onCloseNotificationsDrawer: props.notifications.onCloseNotificationsDrawer,
  }
  const shouldShowNavigationBarWithNovuNotifications = props.username !== undefined && novuSignature !== undefined

  const isNewChefDownloadFeatureFlagEnabled = featureManager.isEnabled(FeatureFlags.NewChefDownload)
  const headerBannerContent =
    withInstallReminder && isNewChefDownloadFeatureFlagEnabled ? (
      <InstallReminder onCloseClick={onCloseInstallReminderClick} />
    ) : undefined

  return shouldShowNavigationBarWithNovuNotifications ? (
    <NavigationBarWithNovuNotifications
      {...props}
      accountNavigationMenuitems={accountNavigationMenuitems}
      headerBannerContent={headerBannerContent}
    />
  ) : (
    <NavigationBar
      {...props}
      notifications={notifications}
      accountNavigationMenuitems={accountNavigationMenuitems}
      headerBannerContent={headerBannerContent}
    />
  )
}
