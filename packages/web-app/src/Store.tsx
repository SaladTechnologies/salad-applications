import type { AxiosInstance } from 'axios'
import { action, autorun, configure, flow, observable } from 'mobx'
import { RouterStore } from 'mobx-react-router'
import type { FeatureManager } from './FeatureManager'
import { UIStore } from './UIStore'
import { AchievementsStore } from './modules/achievements'
import { AnalyticsStore } from './modules/analytics'
import { AuthStore } from './modules/auth'
import { BalanceStore } from './modules/balance'
import { BonusStore } from './modules/bonus'
import { RefreshService } from './modules/data-refresh'
import { EngagementStore } from './modules/engagement'
import { ErrorBoundaryStore } from './modules/error-boundary'
import { HelpScoutStore } from './modules/helpscout/HelpScoutStore'
import { HomeStore } from './modules/home/HomeStore'
import { NotificationStore } from './modules/notifications'
import { OnboardingStore } from './modules/onboarding'
import { ProfileStore } from './modules/profile'
import type { Profile } from './modules/profile/models'
import { ReferralStore } from './modules/referral'
import { RewardStore } from './modules/reward'
import { SaladCardStore } from './modules/salad-card/SaladCardStore'
import { StartButtonUIStore } from './modules/start-button/StartButtonUIStore'
import { StorefrontStore } from './modules/storefront/StorefrontStore'
import { TermsAndConditionsStore } from './modules/terms-and-conditions'
import { VaultStore } from './modules/vault'
import { ExperienceStore } from './modules/xp'

configure({
  // computedRequiresReaction: process.env.NODE_ENV === 'development',
  enforceActions: 'always',
  // observableRequiresReaction: process.env.NODE_ENV === 'development',
  // reactionRequiresObservable: process.env.NODE_ENV === 'development',
})

let sharedStore: RootStore

export const createStore = (axios: AxiosInstance, featureManager: FeatureManager): RootStore => {
  sharedStore = new RootStore(axios, featureManager)
  return sharedStore
}

/** Gets the instance of the store */
//NOTE: Switch this to useContext instead of the singleton
export const getStore = (): RootStore => sharedStore

export class RootStore {
  @observable
  public appLoading: boolean = true
  public appStartTime: Date = new Date()
  public readonly auth: AuthStore
  public readonly termsAndConditions: TermsAndConditionsStore
  public readonly analytics: AnalyticsStore
  public readonly routing: RouterStore
  public readonly xp: ExperienceStore
  public readonly rewards: RewardStore
  public readonly balance: BalanceStore
  public readonly profile: ProfileStore
  public readonly ui: UIStore
  public readonly referral: ReferralStore
  public readonly home: HomeStore
  public readonly refresh: RefreshService
  public readonly notifications: NotificationStore
  public readonly vault: VaultStore
  public readonly engagement: EngagementStore
  public readonly helpScout: HelpScoutStore
  public readonly storefront: StorefrontStore
  public readonly bonuses: BonusStore
  public readonly achievements: AchievementsStore
  public readonly onboarding: OnboardingStore
  public readonly startButtonUI: StartButtonUIStore
  public readonly saladCard: SaladCardStore
  public readonly errorBoundary: ErrorBoundaryStore

  constructor(axios: AxiosInstance, private readonly featureManager: FeatureManager) {
    this.routing = new RouterStore()
    this.auth = new AuthStore(this, axios)
    this.notifications = new NotificationStore(this)
    this.xp = new ExperienceStore(axios)

    this.achievements = new AchievementsStore(axios)
    this.profile = new ProfileStore(this, axios)
    this.termsAndConditions = new TermsAndConditionsStore(axios, this.profile)
    this.saladCard = new SaladCardStore(this, axios)
    this.rewards = new RewardStore(this, axios, this.profile, this.saladCard)
    this.analytics = new AnalyticsStore()
    this.balance = new BalanceStore(this, axios)
    this.ui = new UIStore(this)
    this.referral = new ReferralStore(this, axios)
    this.home = new HomeStore(axios)
    this.refresh = new RefreshService(this)
    this.vault = new VaultStore(axios, this.balance, this.rewards)
    this.engagement = new EngagementStore(this, axios)
    this.helpScout = new HelpScoutStore(axios, this.auth)
    this.storefront = new StorefrontStore(axios)
    this.bonuses = new BonusStore(this, axios)
    this.onboarding = new OnboardingStore(this)
    this.startButtonUI = new StartButtonUIStore(this)
    this.errorBoundary = new ErrorBoundaryStore()

    // Pass AnalyticsStore to FeatureManager
    featureManager.setAnalyticsStore(this.analytics)

    // Start refreshing data
    this.refresh.start()

    autorun(() => {
      if (this.auth.isAuthenticated === undefined) {
        return
      } else if (this.auth.isAuthenticated) {
        this.onLogin()
      } else {
        this.onLogout()
      }
    })
  }

  @action
  setAppLoadedStateFalse = () => {
    this.appLoading = false
  }

  @action
  finishInitialLoading = () => {
    const appLoadFinishedTime = new Date()
    const timeToLoadApp = +appLoadFinishedTime - +this.appStartTime

    // ensures users see the load screen for at least 2 seconds so it doesn't just flash by
    if (timeToLoadApp > 2000) {
      this.setAppLoadedStateFalse()
    } else {
      setTimeout(this.setAppLoadedStateFalse, 2000 - timeToLoadApp)
    }
  }

  onLogin = flow(
    function* (this: RootStore) {
      var profile: Profile = yield this.profile.loadProfile()
      if (!profile) {
        this.auth.logout()
        return
      }

      this.featureManager.handleLogin(profile.id)

      yield Promise.allSettled([
        this.analytics.start(profile),
        this.referral.loadCurrentReferral(),
        this.referral.loadReferralCode(),
        this.refresh.refreshData(),
        this.profile.loadPayPalId(),
        this.saladCard.loadSaladCard(),
        this.helpScout.login({
          name: profile.username,
          email: profile.email,
          lifetimeXP: this.xp.currentXp,
        }),
        this.profile.loadNovuSignature(),
      ])

      const isTermsAndConditionsAccepted = this.termsAndConditions.isTermsAndConditionsAccepted

      if (profile.pendingTermsVersion && isTermsAndConditionsAccepted) {
        yield this.termsAndConditions.submitTermsAndConditions()
      }

      this.finishInitialLoading()
      this.onboarding.showOnboardingIfNeeded()
      this.onboarding.reshowOnboardingPagesIfNeeded()
    }.bind(this),
  )

  @action
  onLogout = (): void => {
    this.referral.currentReferral = undefined
    this.referral.referralCode = ''
    this.onboarding.resetAccountOnboardingPagesCompleted()

    this.analytics.trackLogout()
    this.helpScout.logout()

    this.featureManager.handleLogout()
    this.finishInitialLoading()
  }
}
