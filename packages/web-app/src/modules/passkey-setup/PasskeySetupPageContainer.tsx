import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { PasskeySetupPage } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  isPasskeySupported: store.passkey.isPasskeySupported,
  registerPasskey: store.passkey.registerPasskey,
  backToProfile: () => store.routing.push(`/account/summary`),
})

export const PasskeySetupPageContainer = connect(mapStoreToProps, PasskeySetupPage)
