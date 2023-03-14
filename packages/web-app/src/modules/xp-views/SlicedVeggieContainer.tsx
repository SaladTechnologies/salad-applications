import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { SlicedVeggie } from './components/SlicedVeggie'

const mapStoreToProps = (store: RootStore): any => ({
  percent: store.xp.currentPercentComplete,
  level: store.xp.currentLevel,
})

export const SlicedVeggieContainer = connect(mapStoreToProps, SlicedVeggie)
