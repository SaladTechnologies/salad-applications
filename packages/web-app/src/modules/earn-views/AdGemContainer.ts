import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { AdGemPage } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  userId: store.profile.currentProfile && store.profile.currentProfile.id,
})

export const AdGemContainer = connect(mapStoreToProps, AdGemPage)
