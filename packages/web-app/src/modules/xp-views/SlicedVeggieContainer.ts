import { connect, MapStoreToProps } from '../../connect'
import { SlicedVeggie } from './components/SlicedVeggie'

const mapStoreToProps: MapStoreToProps = store => ({
  percent: store.xp.currentPercentComplete,
  level: store.xp.currentLevel,
})

export const SlicedVeggieContainer = connect(
  mapStoreToProps,
  SlicedVeggie,
)
