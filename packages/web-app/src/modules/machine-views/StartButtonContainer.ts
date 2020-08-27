import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { StartButton } from './components/StartButton'

const mapStoreToProps = (store: RootStore): any => ({
  onClick: store.saladBowl.toggleRunning,
  status: store.saladBowl.status,
  isEnabled: !store.auth.isAuthenticated || store.saladBowl.canRun,
  runningTime: store.saladBowl.runningTime,
  pluginCount: store.saladBowl.pluginCount,
  isDesktop: store.native.isNative,
})

export const StartButtonContainer = connect(mapStoreToProps, StartButton)
