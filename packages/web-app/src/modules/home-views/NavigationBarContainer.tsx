import { Avatar, AvatarDefault, BonusCard, NavigationBar } from '@saladtechnologies/garden-components'
import { connect } from '../../connect'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore): any => {
  const isAuthenticated = store.auth.isAuthenticated
  const isNative = store.native.isNative
  const handleLogin = () => {
    store.analytics.trackButtonClicked('login_button', 'Log In Button', 'enabled')
    store.auth.login()
  }

  const isRunning = store.saladBowl.isRunning

  const goToAccount = () => store.routing.push('/settings/summary')
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
    isNative: isNative,
    onClickAvatar: goToAccount,
    onClickUsername: goToAccount,
    onClickViewAllBonuses: () => store.routing.push('/settings/bonuses'),
    onInternalRoute: (path: string) => store.routing.push(path),
    onLogOut: store.auth.logout,
    onLogin: handleLogin,
    rightSideButtonLabel: isAuthenticated ? undefined : 'Login',
    rightSideButtonClick: isAuthenticated ? undefined : handleLogin,
    startButtonLabel: startButton.label,
    startButtonClick: startButton.onClick,
    startButtonHoverLabel: isAuthenticated && isRunning ? 'Stop' : undefined,
    startButtonErrorClick: startButton.onClickWithError,
    startButtonProgress: startButton.progress,
    startButtonRunningTime: startButton.runningTime,
    username: isAuthenticated ? store.profile.currentProfile?.username : undefined,
  }
}

export const NavigationBarContainer = connect(mapStoreToProps, NavigationBar)
