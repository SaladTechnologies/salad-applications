import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { ONBOARDING_PAGE_NAMES } from '../onboarding/models'
import { AntiVirusSoftware } from '../zendesk/models'
import { AntivirusGuide, AntivirusGuideProps } from './pages/AntivirusGuide'

const mapStoreToProps = (store: RootStore, ownProps: any): Omit<AntivirusGuideProps, 'classes'> => {
  const handleOnCloseClicked = () => {
    store.onboarding.viewNextPage(ONBOARDING_PAGE_NAMES.ANTIVIRUS_CONFIGURATION)
    store.startButtonUI.setStartButtonToolTip(
      'You should be all set! Press the Start button. Once the button text changes to ‘Chopping’, you’ll know the configuration was successful.',
    )
  }

  return {
    antivirusName: store.onboardingAntivirus.selectedAntiVirusGuide,
    loadArticle: () => store.onboardingAntivirus.loadArticle(parseInt(ownProps.match.params.id)),
    onCloseClicked: handleOnCloseClicked,
    articleId: ownProps.match.params.id,
    helpScoutUrl: store.zendesk.helpScoutUrl,
    isNative: store.native.isNative,
    navigateToAVGuide: (antivirusSoftwareName: AntiVirusSoftware, label: string) =>
      store.onboardingAntivirus.navigateToAVGuide(antivirusSoftwareName, label),
    onNoAVClick: () => store.onboarding.viewNextPage(ONBOARDING_PAGE_NAMES.ANTIVIRUS_CONFIGURATION),
  }
}

export const OnboardingSpecificAntivirusGuideContainer = connect(mapStoreToProps, AntivirusGuide)
