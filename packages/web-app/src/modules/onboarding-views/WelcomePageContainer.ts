import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { WelcomePage } from './components/WelcomePage'

const mapStoreToProps = (store: RootStore) => ({
  onNext: store.auth.signIn,
})

export const WelcomePageContainer = connect(
  mapStoreToProps,
  WelcomePage,
)
