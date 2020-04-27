import { connect } from '../../connect'
import { MiningPage } from './pages/MiningPage'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore): any => ({
  status: store.saladBowl.status,
  lifetimeXp: store.xp.currentXp,
  runningTime: store.saladBowl.runningTime,
  machine: store.machine.currentMachine,
})

export const MiningContainer = connect(mapStoreToProps, MiningPage)
