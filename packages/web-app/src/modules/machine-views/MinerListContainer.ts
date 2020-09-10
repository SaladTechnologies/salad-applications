import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { MinerList } from './components/MinerList'

const mapStoreToProps = (store: RootStore): any => ({
  currentPlugin: store.saladBowl.plugin,
})

export const MinerListContainer = connect(mapStoreToProps, MinerList)
