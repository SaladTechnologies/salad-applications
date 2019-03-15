import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { TermsPage } from './components/TermsPage'

const mapStoreToProps = (store: RootStore) => ({
  onAgree: store.profile.agreeToTerms,
  submitting: store.profile.isUpdating,
})

export const TermsPageContainer = connect(
  mapStoreToProps,
  TermsPage,
)
