import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { PasskeySetupPage } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  registerPasskey: () => {},
  backToProfile: () => store.routing.push(`/account/summary`),
  isDeviceSupportPasskey: store.passkey.isDeviceSupportPasskey,
})

export const PasskeySetupPageContainer = connect(mapStoreToProps, PasskeySetupPage)
