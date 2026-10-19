import { NavigationBar, type NavigationBarProps } from '@saladtechnologies/garden-components'
import type { AccountNavigationMenuItem } from '@saladtechnologies/garden-components/lib/components/NavigationBar/components/DesktopNavigationBar/AccountNavigationMenu'
import type { FunctionComponent } from 'react'
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
        {
          label: 'Achievements',
          link: '/account/achievements',
        },
        {
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

  const headerBannerContent = withInstallReminder ? (
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
