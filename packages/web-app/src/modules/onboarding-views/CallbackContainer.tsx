import { connect, MapStoreToProps } from '../../connect'
import { LoadingPage } from '../../components'

const mapStoreToProps: MapStoreToProps = store => ({
  onDidMount: store.auth.handleAuthentication(),
  text: store.auth.loginError ? 'Unable to log in' : 'Loading profile',
})

export const CallbackContainer = connect(
  mapStoreToProps,
  LoadingPage,
)
