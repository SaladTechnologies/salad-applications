import type { RouteComponentProps } from 'react-router'
import type { RootStore } from '../../Store'
import { connect } from '../../connect'
import { PasskeyDeletePage } from './components'

const mapStoreToProps = (store: RootStore, props: RouteComponentProps<{ id: string }>): any => {
  const passkeyId = props.match.params.id
  const passkey = store.passkey.passkeys.find((passkey) => passkey.id === passkeyId)
  const isLastPasskey = store.passkey.passkeys.length === 1

  return {
    isLastPasskey,
    passkey,
    onDeletePasskeyClick: () => store.passkey.deletePasskey(passkeyId),
    backToProfile: () => store.routing.push('/account/summary'),
  }
}

export const PasskeyDeletePageContainer = connect(mapStoreToProps, PasskeyDeletePage)
