import { NavigationBar, type NavigationBarProps } from '@saladtechnologies/garden-components'
import type { AccountNavigationMenuItem } from '@saladtechnologies/garden-components/lib/components/NavigationBar/components/DesktopNavigationBar/AccountNavigationMenu'
import type { FunctionComponent } from 'react'
import { FeatureFlags, useFeatureManager } from '../../../FeatureManager'
import { NavigationBarWithNovuNotifications } from './NavigationBarWithNovuNotifications'

export interface NavigationBarWithNotificationsProps extends NavigationBarProps {
  novuSignature?: string
}

export const NavigationBarWithNotifications: FunctionComponent<NavigationBarWithNotificationsProps> = ({
  novuSignature,
  ...props
}) => {
  const featureManager = useFeatureManager()
  const isAchievementsFeatureFlagEnabled = featureManager.isEnabled(FeatureFlags.Achievements)

  const accountNavigationMenuitems = [
    {
      title: 'Account',
      url: '/account/summary',
      links: [
        {
          label: 'Profile',
          link: '/account/summary',
        },
        {
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

  return shouldShowNavigationBarWithNovuNotifications ? (
    <NavigationBarWithNovuNotifications {...props} accountNavigationMenuitems={accountNavigationMenuitems} />
  ) : (
    <NavigationBar {...props} notifications={notifications} accountNavigationMenuitems={accountNavigationMenuitems} />
  )
}
