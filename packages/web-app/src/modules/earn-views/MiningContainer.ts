import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { MiningPage } from './pages/MiningPage'

const mapStoreToProps = (store: RootStore): any => ({
  isNative: store.native.isNative,
})

export const MiningContainer = connect(mapStoreToProps, MiningPage)
