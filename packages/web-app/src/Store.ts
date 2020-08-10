import { AxiosInstance } from 'axios'
import { autorun, configure, flow } from 'mobx'
import { RouterStore } from 'mobx-react-router'
import { addAuthInterceptor } from './axiosFactory'
import { config } from './config'
import { AnalyticsStore } from './modules/analytics'
import { AuthStore } from './modules/auth'
import { BalanceStore } from './modules/balance'
import { RefreshService } from './modules/data-refresh'
import { EngagementStore } from './modules/engagement'
import { HomeStore } from './modules/home/HomeStore'
import { AutoStartStore, MachineStore, NativeStore } from './modules/machine'
import { NotificationStore } from './modules/notifications'
import { ProfileStore } from './modules/profile'
import { ReferralStore } from './modules/referral'
import { RewardStore } from './modules/reward'
import { SaladBowlStore } from './modules/salad-bowl'
import { StopReason } from './modules/salad-bowl/models'
import { VaultStore } from './modules/vault'
import { VersionStore } from './modules/versions'
import { ExperienceStore } from './modules/xp'
import { UIStore } from './UIStore'

configure({
  // computedRequiresReaction: process.env.NODE_ENV === 'development',
  enforceActions: 'always',
  // observableRequiresReaction: process.env.NODE_ENV === 'development',
  // reactionRequiresObservable: process.env.NODE_ENV === 'development',
})

let sharedStore: RootStore

export const createStore = (axios: AxiosInstance): RootStore => {
  sharedStore = new RootStore(axios)
  return sharedStore
}

/** Gets the instance of the store */
//NOTE: Switch this to useContext instead of the singleton
export const getStore = (): RootStore => sharedStore

export class RootStore {
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
  public readonly saladBowl: SaladBowlStore
  public readonly notifications: NotificationStore
  public readonly vault: VaultStore
  public readonly version: VersionStore
  public readonly engagement: EngagementStore

  constructor(readonly axios: AxiosInstance) {
    this.routing = new RouterStore()
    this.notifications = new NotificationStore(this)
    this.xp = new ExperienceStore(this, axios)
    this.native = new NativeStore(this)
    this.saladBowl = new SaladBowlStore(this)
    this.auth = new AuthStore(config, axios, this.routing)
    this.machine = new MachineStore(this, axios)
    this.rewards = new RewardStore(this, axios)
    this.analytics = new AnalyticsStore(this)
    this.balance = new BalanceStore(this, axios)
    this.profile = new ProfileStore(this, axios)
    this.ui = new UIStore(this)
    this.referral = new ReferralStore(this, axios)
    this.home = new HomeStore(axios)
    this.refresh = new RefreshService(this)
    this.autoStart = new AutoStartStore(this)
    this.vault = new VaultStore(axios)
    this.version = new VersionStore(this, axios)
    this.engagement = new EngagementStore(this)

    addAuthInterceptor(axios, this.auth)

    // Start refreshing data
    this.refresh.start()

    autorun(() => {
      if (this.auth.isAuthenticated) {
        this.onLogin()
      } else {
        this.onLogout()
      }
    })
  }

  onLogin = flow(
    function* (this: RootStore) {
      var profile = yield this.profile.loadProfile()
      if (!profile) {
        this.auth.logout()
        return
      }

      yield Promise.allSettled([
        this.analytics.start(profile),
        this.native.login(profile),
        this.referral.loadCurrentReferral(),
        this.referral.loadReferralCode(),
        this.version.startVersionChecks(),
        this.refresh.refreshData(),
      ])
    }.bind(this),
  )

  onLogout = flow(
    function* (this: RootStore) {
      this.referral.currentReferral = undefined
      this.referral.referralCode = ''

      yield Promise.allSettled([
        this.analytics.trackLogout(),
        this.saladBowl.stop(StopReason.Logout),
        this.version.stopVersionChecks(),
        this.native.logout(),
      ])
    }.bind(this),
  )
}
