import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { AntivirusGuide, AntivirusGuideProps } from './pages/AntivirusGuide'

const mapStoreToProps = (store: RootStore): Omit<AntivirusGuideProps, 'classes'> => {
  return {
    loading: store.onboardingAntivirus.loadingArticle,
    onCloseClicked: () => store.routing.push('/onboarding/antivirus-configuration'),
    onViewAVList: () => store.routing.push('/errors/anti-virus'),
  }
}

export const OnboardingAntivirusGuideListContainer = connect(mapStoreToProps, AntivirusGuide)
