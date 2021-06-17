import { Avatar, AvatarDefault, NavigationBar } from '@saladtechnologies/garden-components'
import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { ErrorPageType } from '../../UIStore'
import { MiningStatus } from '../machine/models'
import { StartActionType } from '../salad-bowl/models'

const mapStoreToProps = (store: RootStore): any => {
  const isAuthenticated = store.auth.isAuthenticated
  const handleLogin = () => {
    store.analytics.trackButtonClicked('login_button', 'Log In Button', 'enabled')
    store.auth.login()
  }

  const status = store.saladBowl.status
  const isRunning = store.saladBowl.isRunning
  const isPrepping = status !== MiningStatus.Running && store.saladBowl.runningTime !== undefined
  const label = !store.saladBowl.isRunning
    ? 'Start'
    : isPrepping
    ? status === MiningStatus.Installing
      ? MiningStatus.Installing
      : MiningStatus.Initializing
    : status

  const goToAccount = () => store.routing.push('/settings/summary')

  return {
    avatar: isAuthenticated ? (
      store.profile.selectedAvatar ? (
        <Avatar
          alt={store.profile.selectedAvatar.name}
          src={store.profile.selectedAvatar.imageUrl}
          onClick={goToAccount}
          variant="highlighted"
        />
      ) : (
        <AvatarDefault onClick={goToAccount} variant="highlighted" />
      )
    ) : undefined,
    balance: isAuthenticated ? store.balance.currentBalance : undefined,
    rightSideButtonLabel: isAuthenticated ? undefined : 'Login',
    rightSideButtonClick: isAuthenticated ? undefined : handleLogin,
    startButtonLabel: isAuthenticated ? label : 'Login',
    startButtonClick: isAuthenticated ? () => store.saladBowl.toggleRunning(StartActionType.StartButton) : handleLogin,
    startButtonHoverLabel: isAuthenticated && isRunning ? 'Stop' : undefined,
    startButtonErrorClick:
      isAuthenticated && store.saladBowl.isNotCompatible
        ? () => store.ui.showErrorPage(ErrorPageType.NotCompatible)
        : undefined,
    startButtonProgress: isPrepping ? store.saladBowl.preppingProgress : isRunning ? 1 : undefined,
    startButtonRunningTime: store.saladBowl.runningTimeDisplay,
    username: isAuthenticated ? store.profile.currentProfile?.username : undefined,
  }
}

export const NavigationBarContainer = connect(mapStoreToProps, NavigationBar)
