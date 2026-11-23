import { useAccountSecurityLoads } from '../../account/account-security.ts'
import type { Profile } from '../../account/profile.ts'
import { useProfile } from '../../account/profile.ts'
import type { RootStore } from '../../Store'
import { useStore } from '../../Store'
import { MobileAccountSummary } from './components'

const mapStoreToProps = (store: RootStore, props: { profile: Profile | undefined }): any => ({
  username: props.profile?.username,
  onLogout: store.auth.logout,
})

/**
 * The mobile account summary. Each time it opens it loads the passkeys, then the profile (its account security
 * section).
 */
export const MobileAccountSummaryContainer = () => {
  const store = useStore()
  useAccountSecurityLoads(store.passkey.fetchPasskeys, store.profile.loadProfile)
  return <MobileAccountSummary {...mapStoreToProps(store, { profile: useProfile() })} />
}
