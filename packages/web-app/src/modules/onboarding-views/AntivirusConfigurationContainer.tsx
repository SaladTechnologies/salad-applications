import { connect } from '../../connect'
import { RootStore } from '../../Store'
import { ONBOARDING_PAGE_NAMES } from '../onboarding/models'
import { AntivirusConfigurationPage, AntivirusConfigurationPageProps } from './pages/AntivirusConfigurationPage'

const mapStoreToProps = (store: RootStore): Omit<AntivirusConfigurationPageProps, 'classes'> => ({
  detectedAV: store.zendesk.detectedAV,
  isNative: store.native.isNative,
  onWhitelistWindowsDefender: store.onboardingAntivirus.whitelistWindowsDefender,
  onViewAVGuide: store.onboardingAntivirus.viewAVGuide.onClick,
  onViewAVGuideLabel: store.onboardingAntivirus.viewAVGuide.label,
  onViewAVGuideSelectionModal: (label: string) => store.onboardingAntivirus.onViewAVGuideSelectionModal(label),
  onViewDiscord: (to: string, label: string) => store.onboardingAntivirus.onTrackButtonClick(to, label),
  onViewGithub: (to: string, label: string) => store.onboardingAntivirus.onTrackButtonClick(to, label),
  whitelistWindowsDefenderErrorMessage: store.onboardingAntivirus.whitelistWindowsDefenderErrorMessage,
  whitelistWindowsDefenderPending: store.onboardingAntivirus.whitelistWindowsDefenderPending,
  onViewAVArticleWithName: (AV: string) => store.onboardingAntivirus.onViewAVArticleWithName(AV),
  onNoAVClick: () => store.onboarding.viewNextPage(ONBOARDING_PAGE_NAMES.ANTIVIRUS_CONFIGURATION),
})

export const AntivirusConfigurationContainer = connect(mapStoreToProps, AntivirusConfigurationPage)
