import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { StartButton } from './components/StartButton'

const mapStoreToProps = (store: RootStore) => ({
  balance: 100,
  rate: 1,
  onClick: () => console.log('Start button clicked'),
  isRunning: false,
  startEnabled: false,
})

export const StartButtonContainer = connect(
  mapStoreToProps,
  StartButton,
)
