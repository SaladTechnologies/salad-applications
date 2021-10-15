import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { getSanitizedHTML } from '../../utils'
import { ONBOARDING_PAGE_NAMES } from '../onboarding/models'
import { AntiVirusSoftware } from '../zendesk/models'
import { AntivirusGuide, AntivirusGuideProps } from './pages/AntivirusGuide'

const mapStoreToProps = (store: RootStore, ownProps: any): Omit<AntivirusGuideProps, 'classes'> => {
  const handleOnCloseClicked = () => {
    store.onboarding.viewNextPage(ONBOARDING_PAGE_NAMES.ANTIVIRUS_CONFIGURATION)
    store.startButtonUI.setStartButtonToolTip(
      'You’ve successfully whitelisted Salad! Press the Start button to begin earning. The initial setup will then happen behind the scenes. This can take up to 30 minutes to complete.',
    )
  }

  return {
    antivirusName: store.onboardingAntivirus.selectedAntiVirusGuide,
    article: store.onboardingAntivirus.helpCenterArticle
      ? getSanitizedHTML(store.onboardingAntivirus.helpCenterArticle)
      : undefined,
    loading: store.onboardingAntivirus.loadingArticle,
    loadArticle: () => store.onboardingAntivirus.loadArticle(parseInt(ownProps.match.params.id)),
    onCloseClicked: handleOnCloseClicked,
    antiVirusGuideVideoId: store.zendesk.antiVirusGuideVideoId,
    articleId: ownProps.match.params.id,
    isNative: store.native.isNative,
    navigateToAVGuide: (antivirusSoftwareName: AntiVirusSoftware, label: string) =>
      store.onboardingAntivirus.navigateToAVGuide(antivirusSoftwareName, label),
    onNoAVClick: () => store.onboarding.viewNextPage(ONBOARDING_PAGE_NAMES.ANTIVIRUS_CONFIGURATION),
  }
}

export const OnboardingSpecificAntivirusGuideContainer = connect(mapStoreToProps, AntivirusGuide)
