import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
import { Account } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  profile: store.profile.currentProfile,
  avatars: store.profile.avatars,
  isUpdating: store.profile.isUpdating,
  onUpdateUsername: store.profile.updateUsername,
  onUpdateMinecraftUsername: store.profile.updateMinecraftUsername,
})

export const AccountContainer = connect(mapStoreToProps, Account)
