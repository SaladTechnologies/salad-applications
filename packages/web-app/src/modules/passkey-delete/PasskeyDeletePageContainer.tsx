import type { PasskeysState } from '../../account/passkeys.ts'
import { usePasskeysState } from '../../account/passkeys.ts'
import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { getStore } from '../../Store'
import { PasskeyDeletePage } from './components'

const mapStoreToProps = (
  store: RootStore,
  props: { match: { params: { id: string } }; passkeysState: PasskeysState },
): any => {
  const passkeyId = props.match.params.id
  const passkey = props.passkeysState.passkeys.find((passkey) => passkey.id === passkeyId)
  const isLastPasskey = props.passkeysState.passkeys.length === 1

  return {
    isLastPasskey,
    passkey,
    onDeletePasskeyClick: () => store.passkey.deletePasskey(passkeyId),
    backToProfile: () => store.routing.push('/account/summary'),
  }
}

const ConnectedPasskeyDeletePage = connect(mapStoreToProps, PasskeyDeletePage)

/** The page that deletes a passkey. It reads the passkeys and passes them down. */
export const PasskeyDeletePageContainer = (props: { match: { params: { id: string } } }) => (
  <ConnectedPasskeyDeletePage match={props.match} passkeysState={usePasskeysState(getStore().passkey)} />
)
