import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { SaladBowlConnectionFailure } from './components/SaladBowlConnectionFailure'

const mapStoreToProps = (store: RootStore): any => {
  const handleOpenSupportTicket = () => {
    store.modalUIStore.hideModal()
    store.zendesk.openSupportTicket()
  }

  const handleRetryConnection = () => {
    store.modalUIStore.hideModal()
    store.saladBowlLogin()
  }
  return {
    onOpenSupportTicket: handleOpenSupportTicket,
    onRetryConnection: handleRetryConnection,
  }
}

export const SaladBowlConnectionFailureContainer = connect(mapStoreToProps, SaladBowlConnectionFailure)
