import { connect } from '../../connect'
import { MiningPage } from './pages/MiningPage'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore): any => ({
  lifetimeXp: store.xp.currentXp,
  machine: store.machine.currentMachine,
})

export const MiningContainer = connect(mapStoreToProps, MiningPage)
