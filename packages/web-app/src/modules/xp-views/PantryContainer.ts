import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { Pantry } from './components/Pantry'

const mapStoreToProps = (store: RootStore): any => {
  const onPantryClicked = (key: string) => {
    store.analytics.trackElementClicked('pantry_element', key)
  }
  return {
    levels: store.xp.levels,
    currentXp: store.xp.currentXp,
    onPantryClicked,
  }
}

export const PantryContainer = connect(mapStoreToProps, Pantry)
