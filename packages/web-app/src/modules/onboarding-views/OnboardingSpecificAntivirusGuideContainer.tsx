import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { getSanitizedHTML } from '../../utils'
import { ONBOARDING_PAGE_NAMES } from '../onboarding/models'
import { AntivirusGuide, AntivirusGuideProps } from './pages/AntivirusGuide'

const mapStoreToProps = (store: RootStore, ownProps: any): Omit<AntivirusGuideProps, 'classes'> => {
  return {
    antivirusName: store.onboardingAntivirus.selectedAntiVirusGuide,
    article: store.onboardingAntivirus.helpCenterArticle
      ? getSanitizedHTML(store.onboardingAntivirus.helpCenterArticle)
      : undefined,
    loading: store.onboardingAntivirus.loadingArticle,
    loadArticle: () => store.onboardingAntivirus.loadArticle(parseInt(ownProps.match.params.id)),
    onCloseClicked: () => store.onboarding.viewNextPage(ONBOARDING_PAGE_NAMES.ANTIVIRUS_CONFIGURATION),
    onViewAVList: () => store.routing.push('/onboarding/antivirus-guide'),
  }
}

export const OnboardingSpecificAntivirusGuideContainer = connect(mapStoreToProps, AntivirusGuide)
