import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
import { AccountMenu } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  authenticated: store.auth.isAuthenticated,
  canLogin: !store.auth.isAuthenticationPending,
  currentBalance: store.balance.currentBalance,
  onClick: () => store.routing.push('/settings/summary'),
  onLogin: store.auth.login,
  username: store.profile.currentProfile?.username,
})

export const AccountMenuContainer = connect(mapStoreToProps, AccountMenu)
