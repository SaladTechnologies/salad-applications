import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { getZendeskAVData } from '../zendesk/utils'
import { AntiVirusFirewallErrorPage } from './components/AntiVirusFirewallErrorPage'

const mapStoreToProps = (store: RootStore): any => {
  const onViewArticle = (name: string) => {
    const id = getZendeskAVData(name).id
    if (id) {
      store.ui.showModal(`/errors/anti-virus/${id}`)
      store.ui.trackAntiVirusGuideLinkClick(id)
    }
  }
  return {
    errorType: store.zendesk.errorType,
    articleList: store.zendesk.antiVirusArticleList,
    fallthrough: store.ui.hasViewedAVErrorPage,
    loading: store.zendesk.loadingArticle,
    loadArticle: () => store.zendesk.loadAntiVirusArticleList(),
    onCloseClicked: () => store.ui.hideModal(true),
    onViewAVList: () => store.routing.push('/errors/anti-virus'),
    onViewArticle: (name: string) => onViewArticle(name),
  }
}

export const GenericAntiVirusErrorContainer = connect(mapStoreToProps, AntiVirusFirewallErrorPage)
