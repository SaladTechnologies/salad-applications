import { AuthStore, TokenStore } from './modules/auth'
import { configure, action, flow } from 'mobx'
import { RouterStore } from 'mobx-react-router'
import { AxiosInstance } from 'axios'
import { ExperienceStore } from './modules/xp'
import { RewardStore } from './modules/reward'
import { BalanceStore } from './modules/balance'
import { MachineStore } from './modules/machine'
import { ProfileStore } from './modules/profile'
import { UIStore } from './UIStore'
import { ReferralStore } from './modules/referral'
import { AnalyticsStore } from './modules/analytics'
import { NativeStore } from './modules/machine/NativeStore'
import { RefreshService } from './modules/data-refresh'
import { featureFlags } from './FeatureFlags'

//Forces all changes to state to be from an action
configure({ enforceActions: 'always' })

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
  public readonly token: TokenStore
  public readonly analytics: AnalyticsStore
  public readonly routing: RouterStore
  public readonly xp: ExperienceStore
  public readonly rewards: RewardStore
  public readonly balance: BalanceStore
  public readonly machine: MachineStore
  public readonly profile: ProfileStore
  public readonly ui: UIStore
  public readonly referral: ReferralStore
  public readonly native: NativeStore
  public readonly refresh: RefreshService

  private machineInfoHeartbeat?: NodeJS.Timeout

  constructor(readonly axios: AxiosInstance) {
    this.analytics = new AnalyticsStore()
    this.routing = new RouterStore()
    this.xp = new ExperienceStore(this, axios)
    this.machine = new MachineStore(this)
    this.native = new NativeStore(this, axios)
    this.auth = new AuthStore(this, axios)
    this.token = new TokenStore()
    this.rewards = new RewardStore(this, axios)
    this.balance = new BalanceStore(this, axios)
    this.profile = new ProfileStore(this, axios)
    this.ui = new UIStore(this)
    this.referral = new ReferralStore(this, axios)
    this.refresh = new RefreshService(this)
  }

  @action.bound
  onLogin = flow(function*(this: RootStore) {
    var profile = yield this.profile.loadProfile()
    this.analytics.start(profile)
    this.referral.loadReferralCode()
    this.xp.refreshXp()
    this.referral.loadCurrentReferral()
    yield featureFlags.loadFeatureFlags(profile.id)

    // Start a timer to keep checking for system information
    this.machineInfoHeartbeat = setInterval(this.tryRegisterMachine, 20000)

    this.tryRegisterMachine()

    this.refresh.start()
  })

  @action
  tryRegisterMachine = () => {
    if (this.native.machineInfo) {
      this.native.registerMachine()
      if (this.machineInfoHeartbeat) clearInterval(this.machineInfoHeartbeat)
    } else {
      this.native.loadMachineInfo()
    }
  }

  @action
  onLogout = () => {
    this.token.saladToken = ''
    this.referral.referralCode = ''
    this.referral.currentReferral = undefined
    this.analytics.trackLogout()
  }
}
