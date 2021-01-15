import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
import { AccountMenu } from './components'

const mapStoreToProps = (store: RootStore): any => {
  const handleLogin = () => {
    const currentPath = window && window.location.pathname
    store.analytics.trackButtonClicked(currentPath, 'login_button', 'Log In Button', 'enabled')
    store.auth.login()
  }

  return {
    authenticated: store.auth.isAuthenticated,
    canLogin: !store.auth.isAuthenticationPending,
    currentBalance: store.balance.currentBalance,
    onClick: () => store.routing.push('/settings/summary'),
    onLogin: handleLogin,
    username: store.profile.currentProfile?.username,
  }
}

export const AccountMenuContainer = connect(mapStoreToProps, AccountMenu)
