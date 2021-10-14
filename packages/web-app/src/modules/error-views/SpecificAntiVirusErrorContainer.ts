import { withRouter } from 'react-router'
import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { getSanitizedHTML } from '../../utils'
import { AntiVirusFirewallErrorPage } from './components/AntiVirusFirewallErrorPage'

const mapStoreToProps = (store: RootStore, ownProps: any): any => ({
  errorType: store.zendesk.errorType,
  antivirusName: store.zendesk.selectedAntiVirusGuide,
  article: store.zendesk.helpCenterArticle ? getSanitizedHTML(store.zendesk.helpCenterArticle) : undefined,
  fallthrough: store.ui.hasViewedAVErrorPage,
  loading: store.zendesk.loadingArticle,
  loadArticle: () => store.zendesk.loadArticle(parseInt(ownProps.match.params.id)),
  onCloseClicked: () => store.ui.hideModal(),
  onViewAVList: () => store.routing.push('/errors/anti-virus'),
  antiVirusGuideVideoId: store.zendesk.antiVirusGuideVideoId,
  isNative: store.native.isNative,
})

export const SpecificAntiVirusErrorContainer = withRouter(connect(mapStoreToProps, AntiVirusFirewallErrorPage))
