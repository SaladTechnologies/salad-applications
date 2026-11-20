import { connect } from '../../connect'
import { isSignedIn, useSession } from '../../data/session.ts'
import type { RootStore } from '../../Store'
import { LoginPanel } from './components/LoginPanel'

interface Props {
  text?: string
  /** Whether the user is signed in: `undefined` until it is known. */
  authenticated: boolean | undefined
}

const mapStoreToProps = (store: RootStore, props: Props): any => ({
  authenticated: props.authenticated,
  // TODO:
  // canLogin: !store.auth.isAuthenticationPending,
  canLogin: true,
  onLogin: store.auth.login,
  onRegister: store.auth.login,
  text: props.text,
})

const ConnectedLoginPanel = connect(mapStoreToProps, LoginPanel)

/** The login panel. It reads the session, which says whether the user is signed in. */
export const LoginPanelContainer = ({ text }: { text?: string }) => (
  <ConnectedLoginPanel text={text} authenticated={isSignedIn(useSession())} />
)
