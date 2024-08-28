import { connect } from '../../../connect'
import type { RootStore } from '../../../Store'
import { AccountSecurity } from './components/AccountSecurity'

const mapStoreToProps = (store: RootStore): any => ({
  fetchPasskeys: store.passkey.fetchPasskeys,
  onAddPasskeyClick: store.passkey.registerPasskey,
  onDeletePasskeyClick: (passkeyId: string) => store.routing.push(`/account/passkey/delete/${passkeyId}`),
  onViewBackupCodesClick: () => store.routing.push('/account/backup-codes'),
  setRegisterPasskeyStatus: store.passkey.setRegisterPasskeyStatus,
  passkeys: store.passkey.passkeys,
  registerPasskeyStatus: store.passkey.registerPasskeyStatus,
  withBackupCodes: store.passkey.passkeys.length !== 0,
})

export const AccountSecurityContainer = connect(mapStoreToProps, AccountSecurity)
