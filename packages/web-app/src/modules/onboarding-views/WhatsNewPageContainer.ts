import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { WhatsNewPage } from './components/WhatsNewPage'

const mapStoreToProps = (store: RootStore): any => ({
  onNext: store.profile.setWhatsNewViewed,
  submitting: store.profile.isUpdating,
})

export const WhatsNewPageContainer = connect(mapStoreToProps, WhatsNewPage)
