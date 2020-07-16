import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { MiningPage } from './pages/MiningPage'

const mapStoreToProps = (store: RootStore): any => ({
  lifetimeXp: store.xp.currentXp,
})

export const MiningContainer = connect(mapStoreToProps, MiningPage)
