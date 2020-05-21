import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { LoginPanel } from './components/LoginPanel'

interface Props {
  text?: string
}

const mapStoreToProps = (store: RootStore, props: Props): any => ({
  authenticated: store.auth.isAuthenticated,
  text: props.text,
  onRegister: store.auth.login,
  onLogin: store.auth.login,
})

export const LoginPanelContainer = connect(mapStoreToProps, LoginPanel)
