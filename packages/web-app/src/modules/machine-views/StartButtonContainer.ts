import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { ErrorPageType } from '../../UIStore'
import { StartActionType } from '../salad-bowl/models'
import { StartButton } from './components/StartButton'

const mapStoreToProps = (store: RootStore): any => ({
  isLarge: true,
  isRunning: store.saladBowl.isRunning,
  onClick: () => store.saladBowl.toggleRunning(StartActionType.StartButton),
  onClickError: store.saladBowl.isNotCompatible ? () => store.ui.showErrorPage(ErrorPageType.NotCompatible) : undefined,
  progress: store.saladBowl.preppingProgress,
  runningTime: store.saladBowl.runningTime,
  status: store.saladBowl.status,
})

export const StartButtonContainer = connect(mapStoreToProps, StartButton)
