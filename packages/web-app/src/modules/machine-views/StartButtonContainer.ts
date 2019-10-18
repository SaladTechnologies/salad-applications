import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { StartButton } from './components/StartButton'

const mapStoreToProps = (store: RootStore) => ({
  balance: store.balance.currentBalance,
  lifetimeBalance: store.balance.lifetimeBalance,
  onClick: store.saladBowl.toggleRunning,
  isRunning: store.saladBowl.isRunning,
  startEnabled: store.saladBowl.connected && store.machine.minerId !== undefined,
})

export const StartButtonContainer = connect(
  mapStoreToProps,
  StartButton,
)
