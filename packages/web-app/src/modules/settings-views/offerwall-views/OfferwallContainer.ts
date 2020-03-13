import { connect } from '../../../connect'
import { RootStore } from '../../../Store'
import { Offerwall } from './components'

const mapStoreToProps = (store: RootStore): any => ({
  offerwall: store.offerwall.offerwall,
  offerwallToggle: store.offerwall.toggleOfferwall,
  playerId: store.profile.currentProfile && store.profile.currentProfile.id
})

export const OfferwallContainer = connect(mapStoreToProps, Offerwall)
