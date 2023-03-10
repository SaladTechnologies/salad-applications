import { Avatar, AvatarDefault, BonusCard, NavigationBar } from '@saladtechnologies/garden-components'
import { connect } from '../../connect'
import type { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore): any => {
  const isAuthenticated = store.auth.isAuthenticated
  const handleLogin = () => {
    store.analytics.trackButtonClicked('login_button', 'Log In Button', 'enabled')
    store.auth.login()
  }

  const goToAccount = () => store.routing.push('/account/summary')
  const bonus = store.bonuses.firstExpiringUnclaimedBonus

  const selectedAvatar = store.profile.profileAvatar

  const startButton = store.startButtonUI.properties

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
    isNative: false,
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
    startButtonProgress: startButton.progress,
    startButtonRunningTime: startButton.runningTime,
    startButtonToolTip: startButton.toolTip,
    startButtonToolTipError: startButton.toolTipError,
    username: isAuthenticated ? store.profile.currentProfile?.username : undefined,
  }
}

export const NavigationBarContainer = connect(mapStoreToProps, NavigationBar)
