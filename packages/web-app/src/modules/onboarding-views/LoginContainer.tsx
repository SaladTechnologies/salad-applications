import { connect } from '../../connect'
import { LoadingPage } from '../../components'
import { RootStore } from '../../Store'

const mapStoreToProps = (store: RootStore) => ({
  onDidMount: store.auth.signIn(),
  text: 'Redirecting to login',
})

export const LoginContainer = connect(
  mapStoreToProps,
  LoadingPage,
)
