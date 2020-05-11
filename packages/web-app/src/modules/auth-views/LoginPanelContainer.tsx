import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { LoginPanel } from './components/LoginPanel'

interface Props {
  text?: string
}

const mapStoreToProps = (store: RootStore, props: Props): any => ({
  authenticated: store.auth.isAuth,
  text: props.text,
  onRegister: store.auth.signIn,
  onLogin: store.auth.signIn,
})

export const LoginPanelContainer = connect(mapStoreToProps, LoginPanel)
