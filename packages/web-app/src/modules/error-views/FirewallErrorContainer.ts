import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { AntiVirusFirewallErrorPage } from './components/AntiVirusFirewallErrorPage'

const mapStoreToProps = (store: RootStore): any => {
  return {
    errorType: store.helpScout.errorType,
    fallthrough: store.ui.hasViewedFirewallErrorPage,
    loadArticle: () => store.helpScout.loadFirewallArticle(),
    onCloseClicked: () => store.ui.hideModal(true),
    helpScoutFirewallArticle: store.helpScout.helpScoutFirewallArticle,
  }
}

export const FirewallErrorContainer = connect(mapStoreToProps, AntiVirusFirewallErrorPage)
