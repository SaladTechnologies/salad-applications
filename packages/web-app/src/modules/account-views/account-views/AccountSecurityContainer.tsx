import { connect } from '../../../connect'
import type { RootStore } from '../../../Store'
import { AccountSecurity } from './components/AccountSecurity'

const mapStoreToProps = (store: RootStore): any => ({
  fetchPasskeys: store.passkey.fetchPasskeys,
  onAddPasskeyClick: () => store.routing.push('/account/passkey/setup'),
  onDeletePasskeyClick: (passkeyId: string) => store.routing.push(`/account/passkey/delete/${passkeyId}`),
  onViewBackupCodesClick: () => store.routing.push('/account/backup-codes'),
  passkeys: store.passkey.passkeys,
  withBackupCodes: store.passkey.passkeys.length !== 0,
})

export const AccountSecurityContainer = connect(mapStoreToProps, AccountSecurity)
