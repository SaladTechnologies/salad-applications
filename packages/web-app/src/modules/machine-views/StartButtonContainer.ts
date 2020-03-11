import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { StartButton } from './components/StartButton'

const mapStoreToProps = (store: RootStore): any => ({
  currentBalance: store.balance.currentBalance,
  lifetimeBalance: store.balance.lifetimeBalance,
  onClick: store.saladBowl.toggleRunning,
  isRunning: store.saladBowl.isRunning,
  startEnabled: store.saladBowl.canRun,
  status: store.saladBowl.status,
})

export const StartButtonContainer = connect(mapStoreToProps, StartButton)
