import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { withLogin } from '../auth-views'
import { MobileAccountSummary } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  passkeys: store.passkey.passkeys,
  username: store.profile.currentProfile?.username,
  onAddPasskeyClick: () => store.routing.push('/account/passkey/setup'),
  onDeletePasskeyClick: (passkeyId: string) => store.routing.push(`/account/passkey/delete/${passkeyId}`),
  onLogout: store.auth.logout,
  fetchPasskeys: store.passkey.fetchPasskeys,
})

export const MobileAccountSummaryContainer = connect(mapStoreToProps, withLogin(MobileAccountSummary))
