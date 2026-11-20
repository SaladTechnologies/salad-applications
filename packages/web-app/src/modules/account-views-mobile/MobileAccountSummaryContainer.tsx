import { useAccountSecurityLoads } from '../../account/account-security.ts'
import type { Profile } from '../../account/profile.ts'
import { useProfile } from '../../account/profile.ts'
import { connect } from '../../connect'
import type { RootStore } from '../../Store'
import { getStore } from '../../Store'
import { MobileAccountSummary } from './components'

const mapStoreToProps = (store: RootStore, props: { profile: Profile | undefined }): any => ({
  username: props.profile?.username,
  onLogout: store.auth.logout,
})

const ConnectedMobileAccountSummary = connect(mapStoreToProps, MobileAccountSummary)

/**
 * The mobile account summary. Each time it opens it loads the passkeys, then the profile (its account security
 * section).
 */
export const MobileAccountSummaryContainer = () => {
  const store = getStore()
  useAccountSecurityLoads(store.passkey.fetchPasskeys, store.profile.loadProfile)
  return <ConnectedMobileAccountSummary profile={useProfile()} />
}
