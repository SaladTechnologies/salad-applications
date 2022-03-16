import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { getSanitizedHTML } from '../../utils'
import { AntiVirusFirewallErrorPage } from './components/AntiVirusFirewallErrorPage'

const mapStoreToProps = (store: RootStore): any => {
  return {
    errorType: store.zendesk.errorType,
    article: store.zendesk.helpCenterArticle ? getSanitizedHTML(store.zendesk.helpCenterArticle) : undefined,
    fallthrough: store.ui.hasViewedFirewallErrorPage,
    loading: store.zendesk.loadingArticle,
    loadArticle: () => store.zendesk.loadFirewallArticle(),
    onCloseClicked: () => store.ui.hideModal(true),
    helpScoutFirewallArticle: store.zendesk.helpScoutFirewallArticle,
  }
}

export const FirewallErrorContainer = connect(mapStoreToProps, AntiVirusFirewallErrorPage)
