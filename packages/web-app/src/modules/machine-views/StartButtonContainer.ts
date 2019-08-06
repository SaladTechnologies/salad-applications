import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { StartButton } from './components/StartButton'

const mapStoreToProps = (store: RootStore) => ({
  balance: store.balance.currentBalance,
  rate: store.balance.currentEarningRate,
  onClick: store.native.toggleRunning,
  isRunning:true, // store.native.isRunning,
  startEnabled: true,// store.native.isNative && store.native.isCompatible,
})

export const StartButtonContainer = connect(
  mapStoreToProps,
  StartButton,
)
