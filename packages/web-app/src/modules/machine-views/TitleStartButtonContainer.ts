import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { TitleStartButton } from './components/TitleStartButton'

const mapStoreToProps = (store: RootStore): any => {
  const isEnabled = !store.auth.isAuthenticated || store.saladBowl.canRun
  const currentPath = window && window.location.pathname
  const onClick = () => {
    if (!isEnabled) {
      store.analytics.trackButtonClicked(currentPath, 'start_button', 'Start Button', 'disabled')
    } else {
      store.analytics.trackButtonClicked(currentPath, 'start_button', 'Start Button', 'enabled')
      store.saladBowl.toggleRunning()
    }
  }
  return {
    onClick,
    onClickError: () => store.routing.push('/earn/mine/miner-details'),
    status: store.saladBowl.status,
    isEnabled,
    runningTime: store.saladBowl.runningTime,
    errorMessage:
      store.auth.isAuthenticated && !store.saladBowl.canRun && 'No compatible GPUs found. Click for more details.',
  }
}

export const TitleStartButtonContainer = connect(mapStoreToProps, TitleStartButton)
