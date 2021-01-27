import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { MiningStatus } from '../machine/models'
import { TitleStartButton } from './components/TitleStartButton'

const mapStoreToProps = (store: RootStore): any => {
  const notCompatible = !store.saladBowl.canRun
  const status = store.saladBowl.status
  const isRunning =
    status === MiningStatus.Installing || status === MiningStatus.Initializing || status === MiningStatus.Running

  const onClick = () => {
    const currentPath = window && window.location.pathname
    store.analytics.trackButtonClicked(currentPath, 'start_button', 'Start Button', 'enabled')
    if (notCompatible && !isRunning) {
      store.ui.showModal('/errors/not-compatible')
    } else {
      store.saladBowl.toggleRunning()
    }
  }

  return {
    isRunning,
    notCompatible,
    onClick,
    onClickError: () => store.ui.showModal('/errors/not-compatible'),
    runningTime: store.saladBowl.runningTime,
    status,
  }
}

export const TitleStartButtonContainer = connect(mapStoreToProps, TitleStartButton)
