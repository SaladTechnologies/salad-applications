import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { MiningInformation } from './components/MiningInformation'

const mapStoreToProps = (store: RootStore): any => {
  return {
    isNative: store.native.isNative,
  }
}

export const MiningInformationContainer = connect(mapStoreToProps, MiningInformation)
