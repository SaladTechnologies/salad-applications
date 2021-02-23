import { withRouter } from 'react-router'
import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { getSanitizedHTML } from '../../utils'
import { AntiVirusErrorPage } from './components/AntiVirusErrorPage'

const mapStoreToProps = (store: RootStore, ownProps: any): any => ({
  antivirus: store.zendesk.selectedAntiVirusGuide,
  article: store.zendesk.helpCenterArticle ? getSanitizedHTML(store.zendesk.helpCenterArticle) : undefined,
  fallthrough: store.saladBowl.hasViewedAVErrorPage,
  loading: store.zendesk.loadingArticle,
  loadArticle: () => store.zendesk.loadArticle(parseInt(ownProps.match.params.id)),
  onCloseClicked: () => store.ui.hideModal(),
  onViewAVList: () => store.routing.push('/errors/anti-virus'),
})

export const SpecificAntiVirusErrorContainer = withRouter(connect(mapStoreToProps, AntiVirusErrorPage))
