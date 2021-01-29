import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { ErrorPageType } from '../../UIStore'
import { MiningStatus } from '../machine/models'
import { TitleStartButton } from './components/TitleStartButton'

const mapStoreToProps = (store: RootStore): any => {
  const notCompatible = !store.saladBowl.canRun
  const status = store.saladBowl.status
  const isRunning =
    status === MiningStatus.Installing || status === MiningStatus.Initializing || status === MiningStatus.Running

  return {
    isRunning,
    notCompatible,
    onClick: () => store.saladBowl.onStartButtonClicked(),
    onClickError: () => store.ui.showErrorPage(ErrorPageType.NotCompatible),
    runningTime: store.saladBowl.runningTime,
    status,
  }
}

export const TitleStartButtonContainer = connect(mapStoreToProps, TitleStartButton)
