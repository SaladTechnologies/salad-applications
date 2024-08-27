import { connect } from '../../../connect'
import type { RootStore } from '../../../Store'
import { AccountSecurity } from './components/AccountSecurity'

const mapStoreToProps = (store: RootStore): any => ({
  isEditPasskeyNameSubmitSuccess: store.passkey.isEditPasskeyNameSubmitSuccess,
  isEditPasskeySubmitting: store.passkey.isEditPasskeySubmitting,
  passkeys: store.passkey.passkeys,
  withBackupCodes: store.passkey.passkeys.length !== 0,
  editPasskeyName: store.passkey.editPasskeyName,
  fetchPasskeys: store.passkey.fetchPasskeys,
  onAddPasskeyClick: () => store.routing.push('/account/passkey/setup'),
  onDeletePasskeyClick: (passkeyId: string) => store.routing.push(`/account/passkey/delete/${passkeyId}`),
  onViewBackupCodesClick: () => store.routing.push('/account/backup-codes'),
})

export const AccountSecurityContainer = connect(mapStoreToProps, AccountSecurity)
