import type { PasskeysState } from '../../account/passkeys.ts'
import { usePasskeysState } from '../../account/passkeys.ts'
import type { RootStore } from '../../Store'
import { useStore } from '../../Store'
import type { Navigation } from '../../routing/navigation.ts'
import { useNavigation } from '../../routing/navigation-context.ts'
import { PasskeyDeletePage } from './components'

const mapStoreToProps = (
  store: RootStore,
  navigation: Navigation,
  props: { match: { params: { id: string } }; passkeysState: PasskeysState },
): any => {
  const passkeyId = props.match.params.id
  const passkey = props.passkeysState.passkeys.find((passkey) => passkey.id === passkeyId)
  const isLastPasskey = props.passkeysState.passkeys.length === 1

  return {
    isLastPasskey,
    passkey,
    onDeletePasskeyClick: () => store.passkey.deletePasskey(passkeyId),
    backToProfile: () => navigation.push('/account/summary'),
  }
}

/** The page that deletes a passkey. It reads the passkeys and passes them down. */
export const PasskeyDeletePageContainer = (props: { match: { params: { id: string } } }) => {
  const store = useStore()
  return (
    <PasskeyDeletePage
      {...mapStoreToProps(store, useNavigation(), {
        match: props.match,
        passkeysState: usePasskeysState(store.passkey),
      })}
    />
  )
}
