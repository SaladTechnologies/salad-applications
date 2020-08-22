import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { AuthStore } from '../auth/AuthStore'
import { FramePage } from './components/FramePage'

const mapStoreToProps = (store: RootStore): any => ({
  createFrameListener: store.auth.createLogoutFrameListener,
  frameSandbox: 'allow-same-origin allow-scripts allow-forms',
  frameTitle: 'Logout - Salad',
  frameUrl: store.auth.logoutUrl,
  onCloseRequested: () => {
    if (
      AuthStore.isStateWithPreviousLocation(store.routing.location.state) &&
      store.routing.location.state.previousLocation !== undefined
    ) {
      store.routing.goBack()
    } else {
      store.routing.push('/')
    }
  },
})

export const LogoutPageContainer = connect(mapStoreToProps, FramePage)
