import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { LoginPage } from './components/LoginPage'

const mapStoreToProps = (store: RootStore): any => ({
  onCancel: store.routing.goBack,
  onSubmit: store.routing.goBack,
})

export const LoginPageContainer = connect(mapStoreToProps, LoginPage)
