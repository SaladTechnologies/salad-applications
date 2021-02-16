import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { ErrorPageType } from '../../UIStore'
import { StartActionType } from '../salad-bowl/models'
import { TitleStartButton } from './components/TitleStartButton'

const mapStoreToProps = (store: RootStore): any => ({
  isRunning: store.saladBowl.isRunning,
  notCompatible: store.saladBowl.isNotCompatible,
  onClick: () => store.saladBowl.toggleRunning(StartActionType.StartButton),
  onClickError: () => store.ui.showErrorPage(ErrorPageType.NotCompatible),
  runningTime: store.saladBowl.runningTime,
  status: store.saladBowl.status,
})

export const TitleStartButtonContainer = connect(mapStoreToProps, TitleStartButton)
