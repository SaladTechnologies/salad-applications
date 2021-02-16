import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { StartActionType } from '../salad-bowl/models'
import { StartButton } from './components/StartButton'

const mapStoreToProps = (store: RootStore): any => ({
  onClick: () => store.saladBowl.toggleRunning(StartActionType.StartButton),
  isRunning: store.saladBowl.isRunning,
  status: store.saladBowl.status,
  notCompatible: store.saladBowl.isNotCompatible,
  runningTime: store.saladBowl.runningTime,
  pluginCount: store.saladBowl.pluginCount,
  isDesktop: store.native.isNative,
})

export const StartButtonContainer = connect(mapStoreToProps, StartButton)
