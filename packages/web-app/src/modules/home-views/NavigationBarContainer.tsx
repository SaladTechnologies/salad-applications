import { Avatar, AvatarDefault, BonusCard } from '@saladtechnologies/garden-components'
import type { TargetRewardInfo } from '@saladtechnologies/garden-components/lib/components/NavigationBar/components/DesktopNavigationBar/TargetRewardStatus'
import { useState } from 'react'
import { startButton as startButtonFor } from '../../app/start-button.ts'
import type { RootStore } from '../../Store'
import { connect } from '../../connect'
import { NavigationBarWithNotifications } from './components/NavigationBarWithNotifications'

/** The notifications drawer's state, which the navigation bar container holds. */
interface DrawerProps {
  isNotificationsDrawerOpened: boolean
  setIsNotificationsDrawerOpened: (isOpened: boolean) => void
}

const mapStoreToProps = (store: RootStore, drawer: DrawerProps): any => {
  const isAuthenticated = store.auth.isAuthenticated
  const handleLogin = () => {
    store.analytics.trackButtonClicked('login_button', 'Log In Button', 'enabled')
    store.auth.login()
  }

  const handleCloseInstallReminderClick = () => {
    store.profile.setIsInstallReminderClosed(true)
  }

  const bonus = store.bonuses.firstExpiringUnclaimedBonus

  const selectedAvatar = store.profile.profileAvatar

  const startButton = startButtonFor(isAuthenticated, handleLogin)

  const targetReward: TargetRewardInfo | null = store.rewards.selectedTargetReward
    ? {
        id: store.rewards.selectedTargetReward.id,
        label: store.rewards.selectedTargetReward.name,
        imageSrc: store.rewards.selectedTargetReward.coverImage ?? '',
        price: store.rewards.selectedTargetReward.price,
        canBeRedeemed: store.balance.currentBalance >= store.rewards.selectedTargetReward?.price,
      }
    : null
  const notifications = {
    isNotificationsDrawerOpened: drawer.isNotificationsDrawerOpened,
    onOpenNotificationsDrawer: () => drawer.setIsNotificationsDrawerOpened(true),
    onCloseNotificationsDrawer: () => drawer.setIsNotificationsDrawerOpened(false),
  }

  const goToAccount = () => store.routing.push('/account/summary')
  const goToSelectTargetRewardPage = () => store.routing.push('/store/select-target-reward')
  const goToTargetRewardPage = () => store.routing.push(`/store/rewards/${targetReward?.id}`)

  return {
    avatar: isAuthenticated ? (
      selectedAvatar ? (
        <Avatar alt={selectedAvatar.name} src={selectedAvatar.imageUrl} variant="highlighted" />
      ) : (
        <AvatarDefault variant="highlighted" />
      )
    ) : undefined,
    balance: isAuthenticated ? store.balance.currentBalance : undefined,
    bonusCard: bonus ? (
      <BonusCard
        key={bonus.id}
        buttonLabel="Claim"
        description="" // description doesn't show in small variant
        header={bonus.reason || ''}
        image={bonus.iconImageUrl || ''}
        imageAlt={bonus.name || 'bonus image'}
        onClick={() => store.bonuses.claimBonus(bonus.id)}
        title={bonus.name || ''}
        variant="small"
        isLoading={store.bonuses.pendingBonuses?.has(bonus.id)}
      />
    ) : undefined,
    onClickAvatar: goToAccount,
    onClickUsername: goToAccount,
    onClickViewAllBonuses: () => store.routing.push('/account/bonuses'),
    onInternalRoute: (path: string) => store.routing.push(path),
    onLogOut: store.auth.logout,
    onLogin: handleLogin,
    rightSideButtonLabel: isAuthenticated ? undefined : 'Login',
    rightSideButtonClick: isAuthenticated ? undefined : handleLogin,
    startButtonLabel: startButton.label,
    startButtonClick: startButton.onClick,
    startButtonHoverLabel: undefined,
    startButtonErrorClick: undefined,
    onRemoveTargetRewardClick: store.rewards.removeSelectedTargetReward,
    onSelectTargetRewardClick: goToSelectTargetRewardPage,
    onOpenTargetRewardClick: goToTargetRewardPage,
    onCloseInstallReminderClick: handleCloseInstallReminderClick,
    startButtonProgress: undefined,
    startButtonRunningTime: undefined,
    startButtonToolTip: undefined,
    startButtonToolTipError: undefined,
    username: isAuthenticated ? store.profile.currentProfile?.username : undefined,
    targetReward,
    notifications,
    withInstallReminder: store.profile.withInstallReminder,
    isUserReferralsEnabled: store.referral.isUserReferralsEnabled,
  }
}

const ConnectedNavigationBar = connect(mapStoreToProps, NavigationBarWithNotifications)

/** The navigation bar. It holds whether the notifications drawer is open, which the notification store held. */
export const NavigationBarContainer = () => {
  const [isNotificationsDrawerOpened, setIsNotificationsDrawerOpened] = useState(false)
  return (
    <ConnectedNavigationBar
      isNotificationsDrawerOpened={isNotificationsDrawerOpened}
      setIsNotificationsDrawerOpened={setIsNotificationsDrawerOpened}
    />
  )
}
