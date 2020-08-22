import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { LoginPanel } from './components/LoginPanel'

interface Props {
  text?: string
}

const mapStoreToProps = (store: RootStore, props: Props): any => ({
  authenticated: store.auth.isAuthenticated,
  canLogin: !store.auth.isAuthenticationPending,
  onLogin: store.auth.login,
  onRegister: store.auth.login,
  text: props.text,
})

export const LoginPanelContainer = connect(mapStoreToProps, LoginPanel)
