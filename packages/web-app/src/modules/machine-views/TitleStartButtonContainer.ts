import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { TitleStartButton } from './components/TitleStartButton'

const mapStoreToProps = (store: RootStore): any => ({
  onClick: store.saladBowl.toggleRunning,
  onClickError: () => store.routing.push('/earn/mine/miner-details'),
  status: store.saladBowl.status,
  isEnabled: !store.auth.isAuthenticated || store.saladBowl.canRun,
  runningTime: store.saladBowl.runningTime,
  errorMessage:
    store.auth.isAuthenticated && !store.saladBowl.canRun && 'No compatible GPUs found. Click for more details.',
})

export const TitleStartButtonContainer = connect(mapStoreToProps, TitleStartButton)
