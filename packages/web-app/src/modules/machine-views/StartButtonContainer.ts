import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { StartButton } from './components/StartButton'

const mapStoreToProps = (store: RootStore) => ({
  balance: store.balance.currentBalance,
  lifetimeBalance: store.balance.lifetimeBalance,
  onClick: store.native.toggleRunning,
  isRunning: store.native.isRunning,
  startEnabled: store.native.isNative && store.native.isCompatible,
})

export const StartButtonContainer = connect(
  mapStoreToProps,
  StartButton,
)
