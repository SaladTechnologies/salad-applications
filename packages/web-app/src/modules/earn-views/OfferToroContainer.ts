import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { OfferToroPage } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  userId: store.profile.currentProfile && store.profile.currentProfile.id,
})

export const OfferToroContainer = connect(mapStoreToProps, OfferToroPage)
