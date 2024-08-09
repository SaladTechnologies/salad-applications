import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { PasskeySetupPage } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  isPasskeySupported: store.passkey.isPasskeySupported,
  hasRegisterPasskeyFailed: store.passkey.hasRegisterPasskeyFailed,
  registerPasskey: store.passkey.registerPasskey,
  setHasRegisterPasskeyFailed: store.passkey.setHasRegisterPasskeyFailed,
  backToProfile: () => store.routing.push(`/account/summary`),
})

export const PasskeySetupPageContainer = connect(mapStoreToProps, PasskeySetupPage)
