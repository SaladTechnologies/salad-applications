import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { StartButton } from './components/StartButton'

const mapStoreToProps = (store: RootStore) => ({
  balance: store.balance.currentBalance,
  rate: store.balance.currentEarningRate,
  onClick: () => console.log('Start button clicked'),
  isRunning: false,
  startEnabled: false,
})

export const StartButtonContainer = connect(
  mapStoreToProps,
  StartButton,
)
