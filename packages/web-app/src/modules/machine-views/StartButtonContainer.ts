import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { StartButton } from './components/StartButton'

const mapStoreToProps = (store: RootStore): any => ({
  onClick: store.saladBowl.toggleRunning,
  status: store.saladBowl.status,
  isEnabled: store.saladBowl.canRun,
})

export const StartButtonContainer = connect(mapStoreToProps, StartButton)
