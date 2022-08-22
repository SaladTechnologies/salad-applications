import { withRouter } from 'react-router'
import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { AntiVirusFirewallErrorPage } from './components/AntiVirusFirewallErrorPage'

const mapStoreToProps = (store: RootStore, ownProps: any): any => ({
  errorType: store.helpScout.errorType,
  antivirusName: store.helpScout.selectedAntiVirusGuide,
  fallthrough: store.ui.hasViewedAVErrorPage,
  loadArticle: () => store.helpScout.loadArticle(parseInt(ownProps.match.params.id)),
  onCloseClicked: () => store.ui.hideModal(),
  onViewAVList: () => store.routing.push('/errors/anti-virus'),
  antiVirusGuideVideoId: store.helpScout.antiVirusGuideVideoId,
  helpScoutUrl: store.helpScout.helpScoutUrl,
})

export const SpecificAntiVirusErrorContainer = withRouter(connect(mapStoreToProps, AntiVirusFirewallErrorPage))
