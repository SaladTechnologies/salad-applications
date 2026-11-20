import type { AxiosInstance } from 'axios'
import { action, configure, flow, observable, runInAction } from 'mobx'
import { ErrorBoundaryBridge } from './app/error-boundary.ts'
import type { Toasts } from './app/toasts.ts'
import { createToasts } from './app/toasts.ts'
import type { Navigation } from './routing/navigation.ts'
import { AnalyticsStore } from './modules/analytics'
import { AuthStore } from './modules/auth'
import { BackupCodesStore } from './modules/backup-codes'
import { BalanceStore } from './modules/balance'
import { BonusStore } from './modules/bonus'
import { CoinbaseEmailStore } from './modules/coinbase'
import { DedicatedNodesStore } from './modules/dedicated-nodes'
import { RefreshService } from './modules/data-refresh'
import { EngagementStore } from './modules/engagement'
import { HelpScoutStore } from './modules/helpscout/HelpScoutStore'
import type { NotificationMessage } from './modules/notifications/models'
import { NotificationToast } from './modules/notifications-views/components'
import { PasskeyStore } from './modules/passkey-setup'
import { ProfileStore } from './modules/profile'
import type { Profile } from './modules/profile/models'
import { ReferralStore } from './modules/referral'
import { RenderStore } from './modules/render'
import { RewardStore } from './modules/reward'
import { SolanaWalletStore } from './modules/solana-wallet'
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

export const createStore = (
  axios: AxiosInstance,
  setSession: (session: 'yes' | 'no') => void,
  navigation: Navigation,
  loadBanner: () => void,
): RootStore => {
  // Vite compiles decorators the TypeScript way, so each store's field initializers are writes in its constructor.
  // `enforceActions: 'always'` rejects writes outside an action, so construct inside one. (CRA's Babel set initial
  // values without a write.)
  sharedStore = runInAction(() => new RootStore(axios, setSession, navigation, loadBanner))
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
  public readonly routing: Navigation
  public readonly xp: ExperienceStore
  public readonly rewards: RewardStore
  public readonly render: RenderStore
  public readonly balance: BalanceStore
  public readonly profile: ProfileStore
  public readonly referral: ReferralStore
  public readonly refresh: RefreshService
  /** Shows notifications as toasts. */
  public readonly notifications: Toasts<NotificationMessage>
  public readonly vault: VaultStore
  public readonly engagement: EngagementStore
  public readonly helpScout: HelpScoutStore
  public readonly bonuses: BonusStore
  /** Shows or resets the app's error page from outside React. */
  public readonly errorBoundary: ErrorBoundaryBridge
  public readonly passkey: PasskeyStore
  public readonly backupCodes: BackupCodesStore
  public readonly solanaWallet: SolanaWalletStore
  public readonly coinbaseEmail: CoinbaseEmailStore
  public readonly dedicatedNodes: DedicatedNodesStore

  /** Loads the notification banner (src/app/banner.ts), which the app-wide refresh runs signed in or not. */
  public readonly loadBanner: () => void

  constructor(
    axios: AxiosInstance,
    setSession: (session: 'yes' | 'no') => void,
    navigation: Navigation,
    loadBanner: () => void,
  ) {
    this.routing = navigation
    this.loadBanner = loadBanner
    this.auth = new AuthStore(this, axios, setSession)
    this.notifications = createToasts<NotificationMessage>({
      render: (message, onClick) => (
        <NotificationToast {...message} isError={message.type === 'error'} onClick={onClick} />
      ),
      onShown: (message) => this.analytics.trackToastNotificationShown(message),
      onClicked: (message) => this.analytics.trackToastNotificationClicked(message),
      onClosed: (message) => this.analytics.trackToastNotificationClosed(message),
    })
    this.xp = new ExperienceStore(axios)

    this.profile = new ProfileStore(this, axios)
    this.termsAndConditions = new TermsAndConditionsStore(axios, this.profile)
    this.rewards = new RewardStore(this, axios, this.profile)
    this.render = new RenderStore()
    this.analytics = new AnalyticsStore(this.auth)
    this.balance = new BalanceStore(axios)
    this.referral = new ReferralStore(this, axios)
    this.refresh = new RefreshService(this)
    this.vault = new VaultStore(axios, this.balance, this.rewards)
    this.engagement = new EngagementStore(this, axios)
    this.helpScout = new HelpScoutStore(axios, this.auth)
    this.bonuses = new BonusStore(this, axios)
    this.passkey = new PasskeyStore(this, axios)
    this.backupCodes = new BackupCodesStore(this, axios)
    this.errorBoundary = new ErrorBoundaryBridge()
    this.solanaWallet = new SolanaWalletStore(this, axios)
    this.coinbaseEmail = new CoinbaseEmailStore(this, axios)
    this.dedicatedNodes = new DedicatedNodesStore(axios)
  }

  /**
   * The stores that hold data or intent of the signed-in user, which sign-out forgets (src/app/forget-user.ts). The
   * dedicated nodes store is reset by `onLogout` itself.
   */
  userDataStores = () => [
    this.auth,
    this.termsAndConditions,
    this.balance,
    this.bonuses,
    this.xp,
    this.vault,
    this.referral,
    this.profile,
    this.rewards,
    this.solanaWallet,
    this.coinbaseEmail,
    this.passkey,
    this.backupCodes,
  ]

  /** Mirrors the session (src/data/session.ts) into the stores: called when it becomes known and when it changes. */
  onSessionChange = (session: 'yes' | 'no'): void => {
    this.auth.setIsAuthenticated(session === 'yes')
    if (session === 'yes') {
      this.onLogin()
    } else {
      this.onLogout()
    }
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

      yield Promise.allSettled([
        this.analytics.start(profile),
        this.referral.loadCurrentReferral(),
        this.referral.loadReferralCode(),
        this.refresh.refreshData(),
        this.dedicatedNodes.loadEnrollment(),
        this.helpScout.login({
          name: profile.username,
          email: profile.email,
          lifetimeXP: this.xp.currentXp,
        }),
      ])

      const isTermsAndConditionsAccepted = this.termsAndConditions.isTermsAndConditionsAccepted

      if (profile.pendingTermsVersion && isTermsAndConditionsAccepted) {
        yield this.termsAndConditions.submitTermsAndConditions()
      }

      this.finishInitialLoading()
    }.bind(this),
  )

  @action
  onLogout = (): void => {
    this.referral.currentReferral = undefined
    this.referral.referralCode = ''
    this.dedicatedNodes.reset()

    this.analytics.trackLogout()
    this.helpScout.logout()

    this.finishInitialLoading()
  }
}
