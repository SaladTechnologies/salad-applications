import { withRouter } from 'react-router'
import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { AntiVirusFirewallErrorPage } from './components/AntiVirusFirewallErrorPage'

const mapStoreToProps = (store: RootStore, ownProps: any): any => ({
  errorType: store.zendesk.errorType,
  antivirusName: store.zendesk.selectedAntiVirusGuide,
  fallthrough: store.ui.hasViewedAVErrorPage,
  loading: store.zendesk.loadingArticle,
  loadArticle: () => store.zendesk.loadArticle(parseInt(ownProps.match.params.id)),
  onCloseClicked: () => store.ui.hideModal(),
  onViewAVList: () => store.routing.push('/errors/anti-virus'),
  helpScoutUrl: store.zendesk.helpScoutUrl,
})

export const SpecificAntiVirusErrorContainer = withRouter(connect(mapStoreToProps, AntiVirusFirewallErrorPage))
