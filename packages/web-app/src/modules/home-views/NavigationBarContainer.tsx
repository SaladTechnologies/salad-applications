import { Avatar, AvatarDefault, BonusCard, NavigationBar } from '@saladtechnologies/garden-components'
import type { TargetRewardInfo } from '@saladtechnologies/garden-components/lib/components/NavigationBar/components/DesktopNavigationBar/TargetRewardStatus'
import { connect } from '../../connect'
import type { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore): any => {
  const isAuthenticated = store.auth.isAuthenticated
  const handleLogin = () => {
    store.analytics.trackButtonClicked('login_button', 'Log In Button', 'enabled')
    store.auth.login()
  }

  const bonus = store.bonuses.firstExpiringUnclaimedBonus

  const selectedAvatar = store.profile.profileAvatar

  const startButton = store.startButtonUI.properties

  const targetReward: TargetRewardInfo | null = store.rewards.selectedTargetReward
    ? {
        id: store.rewards.selectedTargetReward.id,
        label: store.rewards.selectedTargetReward.name,
        imageSrc: store.rewards.selectedTargetReward.coverImage ?? '',
        price: store.rewards.selectedTargetReward.price,
        canBeRedeemed: store.balance.currentBalance >= store.rewards.selectedTargetReward?.price,
      }
    : null

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
    startButtonErrorClick: startButton.onClickWithError,
    onRemoveTargetRewardClick: store.rewards.removeSelectedTargetReward,
    onSelectTargetRewardClick: goToSelectTargetRewardPage,
    onOpenTargetRewardClick: goToTargetRewardPage,
    startButtonProgress: startButton.progress,
    startButtonRunningTime: startButton.runningTime,
    startButtonToolTip: startButton.toolTip,
    startButtonToolTipError: startButton.toolTipError,
    username: isAuthenticated ? store.profile.currentProfile?.username : undefined,
    targetReward,
  }
}

export const NavigationBarContainer = connect(mapStoreToProps, NavigationBar)
