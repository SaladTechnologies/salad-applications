import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { LoginPage } from './components/LoginPage'

const mapStoreToProps = (store: RootStore): any => ({
  onDidMount: store.auth.handleAuthentication(),
  text: store.auth.loginError ? 'Unable to log in' : 'Loading profile',
  details: store.auth.loginError,
  onRetry: store.auth.signOut,
})

export const CallbackContainer = connect(mapStoreToProps, LoginPage)
