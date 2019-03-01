import { connect, MapStoreToProps } from '../../connect'
import { LoadingPage } from '../../components/LoadingPage'

const mapStoreToProps: MapStoreToProps = store => ({
  // onDidMount: store.auth.signIn(),
  text: 'Welcome to Salad v0.2.0!',
})

export const LoginContainer = connect(
  mapStoreToProps,
  LoadingPage,
)
