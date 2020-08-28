import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { TitleStartButton } from './components/TitleStartButton'

const mapStoreToProps = (store: RootStore): any => ({
  onClick: store.saladBowl.toggleRunning,
  status: store.saladBowl.status,
  isEnabled: !store.auth.isAuthenticated || store.saladBowl.canRun,
  runningTime: store.saladBowl.runningTime,
})

export const TitleStartButtonContainer = connect(mapStoreToProps, TitleStartButton)
