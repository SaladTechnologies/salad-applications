import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { withLogin } from '../auth-views'
import { MobileAccountSummary } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  username: store.profile.currentProfile?.username,
  onLogout: store.auth.logout,
})

export const MobileAccountSummaryContainer = connect(mapStoreToProps, withLogin(MobileAccountSummary))
