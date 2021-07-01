import { Avatar, AvatarDefault, BonusCard, NavigationBar } from '@saladtechnologies/garden-components'
import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { ErrorPageType } from '../../UIStore'
import { MiningStatus } from '../machine/models'
import { StartActionType } from '../salad-bowl/models'

const mapStoreToProps = (store: RootStore): any => {
  const isAuthenticated = store.auth.isAuthenticated
  const isNative = store.native.isNative
  const handleLogin = () => {
    store.analytics.trackButtonClicked('login_button', 'Log In Button', 'enabled')
    store.auth.login()
  }

  const status = store.saladBowl.status
  const isRunning = store.saladBowl.isRunning
  const isPrepping = status !== MiningStatus.Running && store.saladBowl.runningTime !== undefined
  const nativeLabel = !store.saladBowl.isRunning
    ? 'Start'
    : isPrepping
    ? status === MiningStatus.Installing
      ? MiningStatus.Installing
      : MiningStatus.Initializing
    : status

  const label = isNative ? nativeLabel : 'Download'

  const goToAccount = () => store.routing.push('/settings/summary')
  const bonus = store.bonuses.firstExpiringUnclaimedBonus

  return {
    avatar: isAuthenticated ? (
      store.profile.selectedAvatar ? (
        <Avatar
          alt={store.profile.selectedAvatar.name}
          src={store.profile.selectedAvatar.imageUrl}
          variant="highlighted"
        />
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
    rightSideButtonLabel: isAuthenticated ? undefined : 'Login',
    rightSideButtonClick: isAuthenticated ? undefined : handleLogin,
    startButtonLabel: isAuthenticated ? label : 'Login',
    startButtonClick: isNative
      ? () => store.saladBowl.toggleRunning(StartActionType.StartButton)
      : isAuthenticated
      ? () => window.open('https://getsalad.io/', '_blank')
      : handleLogin,
    startButtonHoverLabel: isAuthenticated && isRunning ? 'Stop' : undefined,
    startButtonErrorClick:
      isAuthenticated && isNative && store.saladBowl.isNotCompatible
        ? () => store.ui.showErrorPage(ErrorPageType.NotCompatible)
        : undefined,
    startButtonProgress: isPrepping ? store.saladBowl.preppingProgress : isRunning ? 1 : undefined,
    startButtonRunningTime: store.saladBowl.runningTimeDisplay,
    username: isAuthenticated ? store.profile.currentProfile?.username : undefined,
  }
}

export const NavigationBarContainer = connect(mapStoreToProps, NavigationBar)
