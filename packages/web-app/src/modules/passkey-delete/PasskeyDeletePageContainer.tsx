import type { RouteComponentProps } from 'react-router'
import type { RootStore } from '../../Store'
import { connect } from '../../connect'
import { PasskeyDeletePage } from './components'

const mapStoreToProps = (store: RootStore, props: RouteComponentProps<{ id: string }>): any => {
  const passkeyId = props.match.params.id
  if (!store.passkey.passkeys.some((passkey) => passkey.id === passkeyId)) {
    store.routing.push('/account/summary')
  }

  const passkeyNickname = store.passkey.passkeys.find((passkey) => passkey.id === passkeyId)?.displayName

  return {
    isLastPasskey: store.passkey.passkeys.length < 2,
    passkeyNickname: passkeyNickname,
    onDeletePasskeyClick: () => store.passkey.deletePasskey(passkeyId),
    backToProfile: () => store.routing.push('/account/summary'),
  }
}

export const PasskeyDeletePageContainer = connect(mapStoreToProps, PasskeyDeletePage)
