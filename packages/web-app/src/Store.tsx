import type { AxiosInstance } from 'axios'
import type { Auth } from './account/auth.ts'
import { createAuth } from './account/auth.ts'
import type { BackupCodesStore } from './account/backup-codes.ts'
import { createBackupCodes } from './account/backup-codes.ts'
import type { CoinbaseEmail } from './account/coinbase-email.ts'
import { createCoinbaseEmail } from './account/coinbase-email.ts'
import type { SolanaWallet, WalletProblem } from './account/solana-wallet.ts'
import { createSolanaWallet } from './account/solana-wallet.ts'
import { action, configure, flow, observable, runInAction } from 'mobx'
import type { Bonus, Bonuses, BonusesOptions } from './account/bonuses.ts'
import { bonusTypes } from './account/bonuses.ts'
import type { Passkeys } from './account/passkeys.ts'
import { createPasskeys } from './account/passkeys.ts'
import type { Sudo } from './account/sudo.ts'
import { createSudo } from './account/sudo.ts'
import type { Terms } from './account/terms.ts'
import { createTerms } from './account/terms.ts'
import { ErrorBoundaryBridge } from './app/error-boundary.ts'
import type { Toasts } from './app/toasts.ts'
import { createToasts } from './app/toasts.ts'
import { config } from './config'
import type { Navigation } from './routing/navigation.ts'
import { AnalyticsStore } from './modules/analytics'
import { BalanceStore } from './modules/balance'
import { DedicatedNodesStore } from './modules/dedicated-nodes'
import { RefreshService } from './modules/data-refresh'
import { EngagementStore } from './modules/engagement'
import { HelpScoutStore } from './modules/helpscout/HelpScoutStore'
import type { NotificationMessage } from './modules/notifications/models'
import { NotificationMessageCategory } from './modules/notifications/models'
import { NotificationToast } from './modules/notifications-views/components'
import {
  assertionBody,
  getIsPasskeySupported,
  getPasskeyCredential,
  registerPasskeyCredential,
  registrationBody,
} from './modules/passkey-setup/utils'
import { handlePendingProtectedAction } from './modules/protected-action/utils'
import { ProfileStore } from './modules/profile'
import type { ProfileAccess } from './modules/profile/ProfileStore'
import type { Profile } from './modules/profile/models'
import { RenderStore } from './modules/render'
import { RewardStore } from './modules/reward'
import { VaultStore } from './modules/vault'

configure({
  // computedRequiresReaction: process.env.NODE_ENV === 'development',
  enforceActions: 'always',
  // observableRequiresReaction: process.env.NODE_ENV === 'development',
  // reactionRequiresObservable: process.env.NODE_ENV === 'development',
})

/** Loads the signed-in user's referral data (src/account/referrals.ts). */
interface ReferralsAccess {
  /** Loads the referrals report now. */
  loadReport: () => void
  /** Loads the referral code, and whether referrals are enabled, now. */
  loadCode: () => Promise<void>
  /** Loads the referral the user signed up with now. */
  loadCurrent: () => Promise<void>
}

/** Loads and reads the signed-in user's lifetime XP (src/account/xp.ts). */
interface XpAccess {
  /** Loads it now. */
  load: () => void
  /** Returns it, or 0 before it has loaded. */
  current: () => number
}

/** Creates the signed-in user's bonuses (src/account/bonuses.ts), given what the root store tells them. */
type CreateBonuses = (
  options: Pick<BonusesOptions, 'openReplaceModal' | 'onClaimed' | 'onClaimFailed' | 'refreshData'>,
) => Bonuses

/** The toast that says a bonus is claimed, and where clicking it goes, by the kind of bonus, as the bonus store had it. */
const bonusClaimedNotification = (bonus: Bonus, navigation: Navigation): NotificationMessage => {
  const notification: NotificationMessage = {
    category: NotificationMessageCategory.BonusClaimedSuccess,
    title: `Claimed ${bonus?.name}!`,
    message: 'Congrats on your new bonus!',
    onClick: () => navigation.push('/account/bonuses'),
    autoClose: false,
  }

  switch (bonus?.blockType) {
    case bonusTypes.avatar:
      notification.message = 'Congrats on your new bonus! Your item is on its way. Check your profile for more details.'
      notification.onClick = () => navigation.push('/account/summary')
      break
    case bonusTypes.balance:
      break
    case bonusTypes.earningRate:
      notification.message = 'Your bonus earning rate is now active. Check your earnings for more details.'
      notification.onClick = () => navigation.push('/earn/summary')
      break
    case bonusTypes.reward:
      // NOTE: These should be kept in sync with the notification for successful reward redemptions
      notification.message = 'Congrats on your pick! Your item is on its way. Check your reward vault for more details.'
      notification.onClick = () => navigation.push('/store/vault')
      break
    case bonusTypes.xp:
      break
  }
  return notification
}

let sharedStore: RootStore

export const createStore = (
  axios: AxiosInstance,
  setSession: (session: 'yes' | 'no') => void,
  navigation: Navigation,
  loadBanner: () => void,
  xp: XpAccess,
  referrals: ReferralsAccess,
  bonuses: CreateBonuses,
  profiles: ProfileAccess,
): RootStore => {
  // Vite compiles decorators the TypeScript way, so each store's field initializers are writes in its constructor.
  // `enforceActions: 'always'` rejects writes outside an action, so construct inside one. (CRA's Babel set initial
  // values without a write.)
  sharedStore = runInAction(
    () => new RootStore(axios, setSession, navigation, loadBanner, xp, referrals, bonuses, profiles),
  )
  return sharedStore
}

/** Gets the instance of the store */
//NOTE: Switch this to useContext instead of the singleton
export const getStore = (): RootStore => sharedStore

export class RootStore {
  @observable
  public appLoading: boolean = true
  public appStartTime: Date = new Date()
  /** Signs the user in and out (src/account/auth.ts), and keeps whether they are signed in for the stores. */
  public readonly auth: Auth
  /** The acceptance of the terms and conditions (src/account/terms.ts), which the account page and sign-in share. */
  public readonly terms: Terms
  public readonly analytics: AnalyticsStore
  public readonly routing: Navigation
  public readonly rewards: RewardStore
  public readonly render: RenderStore
  public readonly balance: BalanceStore
  public readonly profile: ProfileStore
  /** Loads the signed-in user's referral data (src/account/referrals.ts): sign-in and the app-wide refresh run it. */
  public readonly referrals: ReferralsAccess
  public readonly refresh: RefreshService
  /** Shows notifications as toasts. */
  public readonly notifications: Toasts<NotificationMessage>
  public readonly vault: VaultStore
  public readonly engagement: EngagementStore
  public readonly helpScout: HelpScoutStore
  /** The signed-in user's bonuses (src/account/bonuses.ts): their loads, their claims, and the claims' state. */
  public readonly bonuses: Bonuses
  /** Shows or resets the app's error page from outside React. */
  public readonly errorBoundary: ErrorBoundaryBridge
  /** The signed-in user's passkeys (src/account/passkeys.ts), and the passkey actions. */
  public readonly passkey: Passkeys
  /** The user's sudo mode: the action waiting for verification, and the sudo challenge. */
  public readonly sudo: Sudo
  /** The signed-in user's backup codes (src/account/backup-codes.ts), and the backup code actions. */
  public readonly backupCodes: BackupCodesStore
  /** The signed-in user's Solana wallet address (src/account/solana-wallet.ts), and the actions on it. */
  public readonly solanaWallet: SolanaWallet
  /** The signed-in user's Coinbase email (src/account/coinbase-email.ts), and the actions on it. */
  public readonly coinbaseEmail: CoinbaseEmail
  public readonly dedicatedNodes: DedicatedNodesStore

  /** Loads the notification banner (src/app/banner.ts), which the app-wide refresh runs signed in or not. */
  public readonly loadBanner: () => void

  /** The signed-in user's lifetime XP (src/account/xp.ts): the app-wide refresh loads it, and sign-in reads it. */
  public readonly xp: XpAccess

  constructor(
    axios: AxiosInstance,
    setSession: (session: 'yes' | 'no') => void,
    navigation: Navigation,
    loadBanner: () => void,
    xp: XpAccess,
    referrals: ReferralsAccess,
    bonuses: CreateBonuses,
    profiles: ProfileAccess,
  ) {
    this.routing = navigation
    this.loadBanner = loadBanner
    this.xp = xp
    this.referrals = referrals
    this.auth = createAuth({
      http: axios,
      setSession,
      navigation,
      loginUrl: config.loginUrl,
      assign: (url) => {
        window.location.assign(url)
      },
    })
    this.sudo = createSudo({ http: axios })
    this.notifications = createToasts<NotificationMessage>({
      render: (message, onClick) => (
        <NotificationToast {...message} isError={message.type === 'error'} onClick={onClick} />
      ),
      onShown: (message) => this.analytics.trackToastNotificationShown(message),
      onClicked: (message) => this.analytics.trackToastNotificationClicked(message),
      onClosed: (message) => this.analytics.trackToastNotificationClosed(message),
    })

    this.profile = new ProfileStore(this, axios, profiles)
    this.terms = createTerms({
      http: axios,
      pendingVersion: () => this.profile.currentProfile?.pendingTermsVersion,
      onAccepted: (profile) => this.profile.setProfileData(profile as Profile),
    })
    this.rewards = new RewardStore(this, axios, this.profile)
    this.render = new RenderStore()
    this.analytics = new AnalyticsStore(this.auth)
    this.balance = new BalanceStore(axios)
    this.refresh = new RefreshService(this)
    this.vault = new VaultStore(axios, this.balance, this.rewards)
    this.engagement = new EngagementStore(this, axios)
    this.helpScout = new HelpScoutStore(axios, this.auth)
    this.bonuses = bonuses({
      openReplaceModal: () => this.routing.push('/bonuses/replace-bonus'),
      onClaimed: (bonus) => this.notifications.sendNotification(bonusClaimedNotification(bonus, this.routing)),
      onClaimFailed: () =>
        this.notifications.sendNotification({
          category: NotificationMessageCategory.BonusClaimedError,
          title: `Uh Oh. Something went wrong.`,
          message: 'Please try to claim the bonus again later',
          autoClose: false,
          type: 'error',
        }),
      refreshData: () => this.refresh.refreshData(),
    })
    this.passkey = createPasskeys({
      http: axios,
      webAuthn: {
        isSupported: getIsPasskeySupported,
        createCredential: async (options) =>
          await registerPasskeyCredential(options as Parameters<typeof registerPasskeyCredential>[0]),
        registrationBody,
        getAssertion: async (options) =>
          await getPasskeyCredential(options as Parameters<typeof getPasskeyCredential>[0]),
        assertionBody,
      },
      onFirstPasskeyAdded: () => {
        this.analytics.trackPasskeyAdded(true)
        this.routing.push('/account/backup-codes', { isFirstPasskeyAdded: true })
      },
      onLastPasskeyRemoved: () => {
        this.analytics.trackPasskeyAdded(false)
      },
      onVerified: this.runPendingProtectedAction,
    })
    this.backupCodes = createBackupCodes({ http: axios, onVerified: this.runPendingProtectedAction })
    this.errorBoundary = new ErrorBoundaryBridge()
    /** Shows a failed wallet or email save as the stores did: an error toast that stays until closed. */
    const notifyWalletProblem = ({ title, message }: WalletProblem): void => {
      this.notifications.sendNotification({
        category: NotificationMessageCategory.FurtherActionRequired,
        title,
        message,
        autoClose: false,
        type: 'error',
      })
    }
    this.solanaWallet = createSolanaWallet({ http: axios, notify: notifyWalletProblem })
    this.coinbaseEmail = createCoinbaseEmail({ http: axios, notify: notifyWalletProblem })
    this.dedicatedNodes = new DedicatedNodesStore(axios)
  }

  /**
   * Runs the protected action waiting for sudo mode, once the user verified. It runs in one MobX action, as it ran
   * inside the passkey and backup code stores' flows, so its MobX changes notify observers together, as before.
   */
  runPendingProtectedAction = (): void => {
    runInAction(() => {
      handlePendingProtectedAction(this)
    })
  }

  /**
   * The stores that hold data or intent of the signed-in user, which sign-out forgets (src/app/forget-user.ts). The
   * dedicated nodes store is reset by `onLogout` itself.
   */
  userDataStores = () => [
    this.sudo,
    this.terms,
    this.balance,
    this.bonuses,
    this.vault,
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
    // Where the analytics `when` and the engagement `autorun` reacted to sign-in.
    this.analytics.checkMarketingTouchpoint()
    this.engagement.checkWhatsNew()
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
        this.referrals.loadCurrent(),
        this.referrals.loadCode(),
        this.refresh.refreshData(),
        this.dedicatedNodes.loadEnrollment(),
        this.helpScout.login({
          name: profile.username,
          email: profile.email,
          lifetimeXP: this.xp.current(),
        }),
      ])

      const isTermsAndConditionsAccepted = this.terms.get().accepted

      if (profile.pendingTermsVersion && isTermsAndConditionsAccepted) {
        yield this.terms.submit()
      }

      this.finishInitialLoading()
    }.bind(this),
  )

  @action
  onLogout = (): void => {
    // The referral code and the user's referral, which this cleared, are forgotten with the rest of the user's data
    // (src/app/forget-user.ts), right after.
    this.dedicatedNodes.reset()

    this.analytics.trackLogout()
    this.helpScout.logout()

    this.finishInitialLoading()
  }
}
