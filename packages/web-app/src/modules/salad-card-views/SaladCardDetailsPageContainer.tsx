import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { SaladCardDetailsPage, SaladCardDetailsPageProps } from './pages/SaladCardDetailsPage'

const mapStoreToProps = (store: RootStore): Omit<SaladCardDetailsPageProps, 'classes'> => ({
  hasSaladCard: store.saladCard.hasSaladCard,
  handleLockSaladCard: store.saladCard.lockSaladCard,
  lockSaladCardErrorMessage: store.saladCard.lockSaladCardErrorMessage,
  isLockSaladCardLoading: store.saladCard.isLockSaladCardLoading,
  handleReplaceSaladCard: store.saladCard.replaceSaladCard,
  replaceSaladCardErrorMessage: store.saladCard.replaceSaladCardErrorMessage,
  isReplaceSaladCardLoading: store.saladCard.isReplaceSaladCardLoading,
  saladCardBalance: store.saladCard.saladCardBalance,
  handleLoadSaladBalance: store.saladCard.loadSaladCardBalance,
  handleLoadSaladCard: store.saladCard.loadSaladCard,
  handleRouteToStore: store.saladCard.routeToStore,
  lastFourSaladCardDigits: store.saladCard.lastFourSaladCardDigits,
})

export const SaladCardDetailsPageContainer = connect(mapStoreToProps, SaladCardDetailsPage)
