import { connect, MapStoreToProps } from '../../connect'
import { LoadingPage } from '../../components'

const mapStoreToProps: MapStoreToProps = store => ({
  onDidMount: store.auth.signIn(),
  text: 'Redirecting to login',
})

export const LoginContainer = connect(
  mapStoreToProps,
  LoadingPage,
)
