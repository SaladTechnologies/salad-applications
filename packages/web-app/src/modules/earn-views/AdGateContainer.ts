import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { AdGatePage } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  userId: store.profile.currentProfile && store.profile.currentProfile.id,
})

export const AdGateContainer = connect(mapStoreToProps, AdGatePage)
