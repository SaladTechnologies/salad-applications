import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { MiningStatus } from '../machine/models'
import { StartButton } from './components/StartButton'

const mapStoreToProps = (store: RootStore): any => {
  const notCompatible = !store.saladBowl.canRun
  const status = store.saladBowl.status
  const isRunning =
    status === MiningStatus.Installing || status === MiningStatus.Initializing || status === MiningStatus.Running

  return {
    onClick: () => store.saladBowl.onStartButtonClicked(),
    isRunning,
    status,
    notCompatible,
    runningTime: store.saladBowl.runningTime,
    pluginCount: store.saladBowl.pluginCount,
    isDesktop: store.native.isNative,
  }
}

export const StartButtonContainer = connect(mapStoreToProps, StartButton)
