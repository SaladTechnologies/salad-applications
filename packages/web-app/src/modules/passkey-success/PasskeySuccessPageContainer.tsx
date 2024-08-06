import { connect } from '../../connect'
import { PasskeySuccessPage } from './components'

const mapStoreToProps = (): any => ({
  viewRecoveryCodes: () => {},
})

export const PasskeySuccessPageContainer = connect(mapStoreToProps, PasskeySuccessPage)
