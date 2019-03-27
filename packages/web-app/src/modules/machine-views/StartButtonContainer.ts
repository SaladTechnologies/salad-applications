import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { StartButton } from './components/StartButton'

const mapStoreToProps = (store: RootStore) => ({
  balance: store.balance.currentBalance,
  rate: store.balance.currentEarningRate,
  onClick: store.native.toggleRunning,
  isRunning: store.native.isRunning,
  startEnabled: store.native.isNative, //TODO: Add in check for a valid GPU
})

export const StartButtonContainer = connect(
  mapStoreToProps,
  StartButton,
)
