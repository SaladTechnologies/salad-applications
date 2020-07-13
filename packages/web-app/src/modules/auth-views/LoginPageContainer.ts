import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { FramePage } from './components/FramePage'

const mapStoreToProps = (store: RootStore): any => ({
  createFrameListener: store.auth.createLoginFrameListener,
  frameSandbox: 'allow-same-origin allow-scripts allow-forms',
  frameTitle: 'Login - Salad',
  frameUrl: store.auth.loginUrl,
  onCloseRequested: store.routing.goBack,
})

export const LoginPageContainer = connect(mapStoreToProps, FramePage)
