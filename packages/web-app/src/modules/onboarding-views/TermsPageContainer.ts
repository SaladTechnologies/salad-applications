import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { TermsPage } from './components/TermsPage'

const mapStoreToProps = (store: RootStore) => ({
  onAgree: store.profile.agreeToTerms,
})

export const TermsPageContainer = connect(
  mapStoreToProps,
  TermsPage,
)
