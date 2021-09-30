import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { ONBOARDING_PAGE_NAMES } from '../onboarding/models'
import { AntivirusGuide, AntivirusGuideProps } from './pages/AntivirusGuide'

const mapStoreToProps = (store: RootStore): Omit<AntivirusGuideProps, 'classes'> => {
  return {
    articleList: store.onboardingAntivirus.antiVirusArticleList,
    loading: store.onboardingAntivirus.loadingArticle,
    loadArticle: () => store.onboardingAntivirus.loadAntiVirusArticleList(),
    onCloseClicked: () => store.routing.push('/onboarding/antivirus-configuration'),
    onNoAVClick: () => store.onboarding.viewNextPage(ONBOARDING_PAGE_NAMES.ANTIVIRUS_CONFIGURATION),
    onViewAVList: () => store.routing.push('/errors/anti-virus'),
    onViewArticleWithId: (id: string) => store.onboardingAntivirus.onViewAVArticleWithId(id),
  }
}

export const OnboardingAntivirusGuideListContainer = connect(mapStoreToProps, AntivirusGuide)
