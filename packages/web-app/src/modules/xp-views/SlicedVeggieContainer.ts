import { connect } from '../../connect'
import { SlicedVeggie } from './components/SlicedVeggie'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore) => ({
  percent: store.xp.currentPercentComplete,
  level: store.xp.currentLevel,
})

export const SlicedVeggieContainer = connect(
  mapStoreToProps,
  SlicedVeggie,
)
