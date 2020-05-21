import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { FramePage } from './components/FramePage'

const mapStoreToProps = (store: RootStore): any => ({
  createFrameListener: store.auth.createLogoutFrameListener,
  frameSandbox: 'allow-same-origin allow-scripts allow-forms',
  frameTitle: 'Logout - Salad',
  frameUrl: store.auth.logoutUrl,
  onCloseRequested: store.routing.goBack,
})

export const LogoutPageContainer = connect(mapStoreToProps, FramePage)
