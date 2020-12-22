import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { Pantry } from './components/Pantry'

const mapStoreToProps = (store: RootStore): any => ({
  levels: store.xp.levels,
  currentXp: store.xp.currentXp,
})

export const PantryContainer = connect(mapStoreToProps, Pantry)
