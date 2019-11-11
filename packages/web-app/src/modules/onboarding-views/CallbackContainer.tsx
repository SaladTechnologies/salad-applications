import { connect } from '../../connect'
import { LoadingPage } from '../../components'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore): any => ({
  onDidMount: store.auth.handleAuthentication(),
  text: store.auth.loginError ? 'Unable to log in' : 'Loading profile',
})

export const CallbackContainer = connect(
  mapStoreToProps,
  LoadingPage,
)
