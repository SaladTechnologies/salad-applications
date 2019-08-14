import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { StartButton } from './components/StartButton'

const mapStoreToProps = (store: RootStore) => ({
  balance: store.balance.currentBalance,
  earnings: store.balance.earnings,
  onClick: store.native.toggleRunning,
  isRunning: store.native.isRunning,
  startEnabled: true, // TODO: 0.2.1 - store.native.isNative && store.native.isCompatible,
})

export const StartButtonContainer = connect(
  mapStoreToProps,
  StartButton,
)
