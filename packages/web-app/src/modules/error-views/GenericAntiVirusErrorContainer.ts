import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { getAVData } from '../onboarding/utils'
import { AntiVirusFirewallErrorPage } from './components/AntiVirusFirewallErrorPage'

const mapStoreToProps = (store: RootStore): any => {
  const onViewArticle = (name: string) => {
    const id = getAVData(name).id
    if (id) {
      store.ui.showModal(`/errors/anti-virus/${id}`)
      store.ui.trackAntiVirusGuideLinkClick(id)
    }
  }
  return {
    errorType: store.helpScout.errorType,
    articleList: store.helpScout.antiVirusArticleList,
    fallthrough: store.ui.hasViewedAVErrorPage,
    loadArticle: () => store.helpScout.loadAntiVirusArticleList(),
    onCloseClicked: () => store.ui.hideModal(true),
    onViewAVList: () => store.routing.push('/errors/anti-virus'),
    onViewArticle: (name: string) => onViewArticle(name),
  }
}

export const GenericAntiVirusErrorContainer = connect(mapStoreToProps, AntiVirusFirewallErrorPage)
