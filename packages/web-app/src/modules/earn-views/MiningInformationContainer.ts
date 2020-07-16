import { connect } from '../../connect'
import { MiningInformation } from './components/MiningInformation'

const mapStoreToProps = (): any => ({})

export const MiningInformationContainer = connect(mapStoreToProps, MiningInformation)
