import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
import { AccountMenu } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  authenticated: store.auth.isAuthenticated(),
  onLogin: store.auth.signIn,
  username: store.profile.currentProfile?.username,
  currentBalance: store.balance.currentBalance,
  onClick: () => store.routing.push('/account/summary'),
})

export const AccountMenuContainer = connect(mapStoreToProps, AccountMenu)
