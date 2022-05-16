import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { SaladCardEnrollmentPage } from './pages/SaladCardEnrollmentPage'

const mapStoreToProps = (store: RootStore): any => ({
  handleCreateSaladCard: store.saladCard.createSaladCard,
  hasAcceptedTerms: store.saladCard.hasAcceptedTerms,
  onToggleAccept: store.saladCard.toggleAcceptTerms,
  isSubmitting: store.saladCard.isSubmitting,
  hasSaladCard: store.saladCard.hasSaladCard,
  handleRouteToStore: store.saladCard.routeToStore,
  handleCheckForSaladCard: store.saladCard.checkForSaladCard,
})

export const SaladCardEnrollmentPageContainer = connect(mapStoreToProps, SaladCardEnrollmentPage)
