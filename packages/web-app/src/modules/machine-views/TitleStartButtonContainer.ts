import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { MiningStatus } from '../machine/models'
import { TitleStartButton } from './components/TitleStartButton'

const mapStoreToProps = (store: RootStore): any => {
  const notCompatible = store.auth.isAuthenticated && !store.saladBowl.canRun
  const isDisabled = !store.machine.cpuCompatible
  const status = store.saladBowl.status
  const isRunning =
    status === MiningStatus.Installing || status === MiningStatus.Initializing || status === MiningStatus.Running

  const onClick = () => {
    const currentPath = window && window.location.pathname
    if (isDisabled || (notCompatible && !isRunning)) {
      store.analytics.trackButtonClicked(
        currentPath,
        'start_button',
        'Start Button',
        isDisabled ? 'disabled' : 'enabled',
      )
      store.ui.showModal('/errors/not-compatible')
    } else {
      store.analytics.trackButtonClicked(currentPath, 'start_button', 'Start Button', 'enabled')
      store.saladBowl.toggleRunning()
    }
  }

  return {
    isDisabled,
    isRunning,
    notCompatible,
    onClick,
    onClickError: () => store.ui.showModal('/errors/not-compatible'),
    runningTime: store.saladBowl.runningTime,
    status,
  }
}

export const TitleStartButtonContainer = connect(mapStoreToProps, TitleStartButton)
