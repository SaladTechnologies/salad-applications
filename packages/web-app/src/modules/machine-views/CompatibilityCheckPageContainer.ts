import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { CompatibilityCheckPage } from './components/CompatibilityCheckPage'

const mapStoreToProps = (store: RootStore): any => ({
  onNext: store.native.skipCompatibility,
  isChecking: store.native.loadingMachineInfo,
  validGPUs: store.native.validGPUs,
  validOS: store.native.validOperatingSystem,
  gpuList: store.native.gpuNames,
})

export const CompatibilityCheckPageContainer = connect(
  mapStoreToProps,
  CompatibilityCheckPage,
)
