import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
import { AccountMenu } from './components'

const mapStoreToProps = (store: RootStore): any => {
  const handleLogin = () => {
    store.analytics.trackButtonClicked('login_button', 'Log In Button', 'enabled')
    store.auth.login()
  }

  return {
    authenticated: store.auth.isAuthenticated,
    // TODO: FIgure this out
    // canLogin: !store.auth.isAuthenticationPending,
    canLogin: true,
    currentBalance: store.balance.currentBalance,
    onClick: () => store.routing.push('/account/summary'),
    onLogin: handleLogin,
    username: store.profile.currentProfile?.username,
  }
}

export const AccountMenuContainer = connect(mapStoreToProps, AccountMenu)
