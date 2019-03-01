import { connect, MapStoreToProps } from '../../connect'
import { LoadingPage } from '../../components/LoadingPage'

const mapStoreToProps: MapStoreToProps = store => ({
  onDidMount: store.auth.handleAuthentication(),
  text: 'Redirecting to login',
})

export const CallbackContainer = connect(
  mapStoreToProps,
  LoadingPage,
)
