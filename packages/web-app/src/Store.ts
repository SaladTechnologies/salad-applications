import { AxiosInstance } from 'axios'
import { action, autorun, configure, flow, observable } from 'mobx'
import { RouterStore } from 'mobx-react-router'
import { FeatureManager } from './FeatureManager'
import { AnalyticsStore } from './modules/analytics'
import { AuthStore } from './modules/auth'
import { BalanceStore } from './modules/balance'
import { BonusStore } from './modules/bonus'
import { RefreshService } from './modules/data-refresh'
import { EngagementStore } from './modules/engagement'
import { HomeStore } from './modules/home/HomeStore'
import { AutoStartStore, MachineStore, NativeStore } from './modules/machine'
import { NotificationStore } from './modules/notifications'
import { OnboardingStore } from './modules/onboarding'
import { ProfileStore } from './modules/profile'
import { Profile } from './modules/profile/models'
import { ReferralStore } from './modules/referral'
import { RewardStore } from './modules/reward'
import { SaladBowlStore } from './modules/salad-bowl'
import { StopReason } from './modules/salad-bowl/models'
import { SeasonsStore } from './modules/seasons'
import { StorefrontStore } from './modules/storefront/StorefrontStore'
import { VaultStore } from './modules/vault'
import { VersionStore } from './modules/versions'
import { ExperienceStore } from './modules/xp'
import { Zendesk } from './modules/zendesk'
import { UIStore } from './UIStore'

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
  public readonly autoStart: AutoStartStore
  public readonly analytics: AnalyticsStore
  public readonly routing: RouterStore
  public readonly xp: ExperienceStore
  public readonly rewards: RewardStore
  public readonly balance: BalanceStore
  public readonly machine: MachineStore
  public readonly profile: ProfileStore
  public readonly ui: UIStore
  public readonly referral: ReferralStore
  public readonly home: HomeStore
  public readonly native: NativeStore
  public readonly refresh: RefreshService
  public readonly saladBowl: SaladBowlStore | undefined
  public readonly notifications: NotificationStore
  public readonly vault: VaultStore
  public readonly version: VersionStore
  public readonly engagement: EngagementStore
  public readonly zendesk: Zendesk
  public readonly storefront: StorefrontStore
  public readonly bonuses: BonusStore
  public readonly seasons: SeasonsStore
  public readonly onboarding: OnboardingStore

  constructor(axios: AxiosInstance, private readonly featureManager: FeatureManager) {
    this.routing = new RouterStore()
    this.auth = new AuthStore(axios, this.routing)
    this.notifications = new NotificationStore(this)
    this.xp = new ExperienceStore(this, axios)
    this.native = new NativeStore(this)

    // if (featureManager.isEnabled('app_salad_bowl')) {
    //   // TODO: Use gRPC version of Salad Bowl.
    // } else {
    this.saladBowl = new SaladBowlStore(this)
    // }

    this.machine = new MachineStore(this, axios)
    this.profile = new ProfileStore(this, axios)
    this.rewards = new RewardStore(this, axios, this.profile)
    this.analytics = new AnalyticsStore(this)
    this.balance = new BalanceStore(axios)
    this.ui = new UIStore(this)
    this.referral = new ReferralStore(this, axios)
    this.home = new HomeStore(axios)
    this.refresh = new RefreshService(this)
    this.autoStart = new AutoStartStore(this)
    this.vault = new VaultStore(axios, this.balance, this.rewards)
    this.version = new VersionStore(this, axios)
    this.engagement = new EngagementStore(this, axios)
    this.zendesk = new Zendesk(axios, this.auth, this.native, this.analytics)
    this.storefront = new StorefrontStore(axios)
    this.bonuses = new BonusStore(this, axios)
    this.seasons = new SeasonsStore(axios)
    this.onboarding = new OnboardingStore(this)

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

    if (this.native.isNative && !this.auth.isAuthenticated) {
      this.routing.replace('/login')
    }
  }

  onLogin = flow(
    function* (this: RootStore) {
      var profile: Profile = yield this.profile.loadProfile()
      if (!profile) {
        this.auth.logout()
        return
      }

      yield Promise.allSettled([
        this.analytics.start(profile),
        this.native.login(profile),
        this.referral.loadCurrentReferral(),
        this.referral.loadReferralCode(),
        this.refresh.refreshData(),
        this.zendesk.login(profile.username, profile.email),
      ])

      this.featureManager.handleLogin(profile.id)
      this.finishInitialLoading()
      this.onboarding.showOnboardingIfNeeded()
    }.bind(this),
  )

  @action
  onLogout = (): void => {
    if (this.saladBowl) {
      this.saladBowl.stop(StopReason.Logout)
    }

    this.referral.currentReferral = undefined
    this.referral.referralCode = ''

    this.analytics.trackLogout()
    this.native.logout()
    this.zendesk.logout()

    this.featureManager.handleLogout()
    this.finishInitialLoading()
  }
}
