import { connect } from '../../connect'
import { Pantry } from './components/Pantry'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore): any => ({
  levels: store.xp.levels,
  currentXp: store.xp.currentXp,
})

export const PantryContainer = connect(mapStoreToProps, Pantry)
