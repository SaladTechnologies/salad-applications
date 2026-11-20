import SaladDefaultAvatarSrc from '@saladtechnologies/garden-components/lib/components/Avatar/assets/SaladAvatar.png'
import type { AxiosInstance, AxiosResponse } from 'axios'
import type { ProfileState, ProtectRewardsRedemptionStatus } from '../../account/profile-state.ts'
import { createProfileState } from '../../account/profile-state.ts'
import type { ExternalState } from '../../app/external-state.ts'
import * as Storage from '../../Storage'
import type { RootStore } from '../../Store'
import type { FormValues } from '../account-views/account-views/components/'
import { NotificationMessageCategory } from '../notifications/models'
import {
  authenticationExternalEndpointPath,
  avatarsEndpointPath,
  avatarsSelectedEndpointPath,
  profileEndpointPath,
  protectRewardsRedemptionEndpointPath,
} from './constants'
import {
  ExternalAuthProviderLoginAction,
  ExternalAuthProviderLoginStatus,
  type Avatar,
  type ExternalAuthProvider,
  type Profile,
} from './models'

export type { ProtectRewardsRedemptionStatus } from '../../account/profile-state.ts'

const SaladDefaultAvatar: Avatar = {
  name: 'Default',
  description: 'Salad Default Avatar',
  imageUrl: SaladDefaultAvatarSrc,
  id: '00000000-0000-0000-0000-000000000000',
}
const installReminderFeatureReleaseDate = new Date('2023-12-21T17:10:47.324Z')
const IS_INSTALL_REMINDER_CLOSED_STORAGE_KEY = 'IS_INSTALL_REMINDER_CLOSED'

/** Where the signed-in user's profile is kept (src/account/profile.ts): the one copy every reader shows. */
export interface ProfileAccess {
  /** Returns the profile, or `undefined` before it has loaded. */
  get: () => Profile | undefined
  /** Keeps the profile. */
  set: (profile: Profile) => void
  /** Forgets the profile. */
  forget: () => void
}

/**
 * The profile's actions and the account page's state around it. The profile itself lives in its query
 * (src/account/profile.ts); this state lives outside MobX, and containers read it with `useProfileState`.
 */
export class ProfileStore {
  private readonly store: RootStore
  private readonly axios: AxiosInstance
  private readonly profiles: ProfileAccess
  private readonly state: ExternalState<ProfileState>
  private protectRewardsRedemptionStatusTimeout: ReturnType<typeof setTimeout> | null = null

  constructor(store: RootStore, axios: AxiosInstance, profiles: ProfileAccess) {
    this.store = store
    this.axios = axios
    this.profiles = profiles
    this.state = createProfileState(Storage.getItem(IS_INSTALL_REMINDER_CLOSED_STORAGE_KEY) === 'true')
  }

  /** Returns the current state. */
  public getState = (): ProfileState => this.state.get()

  /** Calls `listener` after each change, and returns a function that stops that. */
  public subscribe = (listener: () => void): (() => void) => this.state.subscribe(listener)

  /**
   * The signed-in user's profile, or `undefined` before it has loaded. It lives in its query (src/account/profile.ts),
   * not in this store: components read it with `useProfile`, which re-renders them when it changes; this reads it now.
   */
  public get currentProfile(): Profile | undefined {
    return this.profiles.get()
  }

  /**
   * Whether the app shows the install reminder for the profile, read with the profile, the reminder's closed state and
   * the session a component shows (`useProfile`, `useProfileState`, `useSession`).
   */
  public withInstallReminder(
    profile: Profile | undefined,
    isInstallReminderClosed: boolean,
    isAuthenticated: boolean | undefined,
  ): boolean {
    const isProfileCreatedAfterInstallReminderReleaseDate = profile?.createdAt
      ? new Date(profile?.createdAt) > installReminderFeatureReleaseDate
      : false

    return (
      isProfileCreatedAfterInstallReminderReleaseDate &&
      !isInstallReminderClosed &&
      !profile?.saladBowlFirstLoginAt &&
      !!isAuthenticated
    )
  }

  setProfileData = (profileData: Profile) => {
    this.profiles.set(profileData)
    this.store.engagement.checkWhatsNew()
  }

  setIsInstallReminderClosed = (isInstallReminderClosed: boolean) => {
    this.state.update({ isInstallReminderClosed })
    Storage.setItem(IS_INSTALL_REMINDER_CLOSED_STORAGE_KEY, JSON.stringify(isInstallReminderClosed))
  }

  loadProfile = async (): Promise<Profile | undefined> => {
    try {
      const profile = await this.axios.get(profileEndpointPath)
      this.profiles.set(profile.data)
      this.store.errorBoundary.resetErrorBoundary()
    } catch (err) {
      this.profiles.forget()
      this.store.errorBoundary.showErrorBoundary(new Error(`An error occurred: ${err}`))
    }
    this.store.engagement.checkWhatsNew()
    return this.currentProfile
  }

  loadAvatars = async (): Promise<void> => {
    try {
      const avatar = await this.axios.get(avatarsEndpointPath)
      const avatars: Avatar[] | undefined = avatar.data
      avatars?.unshift(SaladDefaultAvatar)
      this.state.update({ avatars })
    } catch (err) {}
  }

  loadSelectedAvatar = async (): Promise<void> => {
    try {
      const selectedAvatar = await this.axios.get(avatarsSelectedEndpointPath)
      const id: string | undefined = selectedAvatar.data?.id
      this.state.update({ currentSelectedAvatar: id, selectedAvatar: id })
    } catch (err) {
      this.state.update({ currentSelectedAvatar: SaladDefaultAvatar.id, selectedAvatar: SaladDefaultAvatar.id })
    }
  }

  setWhatsNewViewed = async (): Promise<void> => {
    if (this.currentProfile === undefined) {
      return
    }

    const whatsNewVersion = this.store.engagement.whatsNewVersion
    if (whatsNewVersion === undefined) {
      return
    }

    try {
      const response = await this.axios.patch(profileEndpointPath, {
        lastSeenApplicationVersion: whatsNewVersion,
      })

      this.profiles.set(response.data)
      this.store.analytics.trackWhatsNew(whatsNewVersion)
    } catch (err) {}
  }

  selectAvatar = async (id: string): Promise<void> => {
    const { avatars, submittingAvatar, selectedAvatar } = this.state.get()
    if (submittingAvatar !== undefined || !avatars || selectedAvatar === id) {
      return
    }
    this.state.update({ avatarError: undefined })
    let avatarId: string | undefined
    if (id === '00000000-0000-0000-0000-000000000000') {
      this.state.update({ selectedAvatar: SaladDefaultAvatar.id, submittingAvatar: SaladDefaultAvatar.id })
      avatarId = '00000000-0000-0000-0000-000000000000'
    } else {
      const found = avatars.find((avatar) => avatar.id === id)?.id
      this.state.update({ selectedAvatar: found, submittingAvatar: found })
      avatarId = id
    }
    try {
      const patch = await this.axios.patch(avatarsSelectedEndpointPath, { avatarId })
      const selected: string | undefined = patch.data?.id
      this.state.update({ currentSelectedAvatar: selected, selectedAvatar: selected })
    } catch (err) {
      this.state.update({
        avatarError: {
          avatar: id,
          message: 'Unable to select avatar',
        },
        selectedAvatar: this.state.get().currentSelectedAvatar,
      })
    } finally {
      this.state.update({ submittingAvatar: undefined })
    }
  }

  clearAvatarError = () => {
    this.state.update({ avatarError: undefined })
  }

  updateUsername = async (username: FormValues): Promise<void> => {
    if (this.currentProfile === undefined) return
    this.state.update({ isUserNameSubmitting: true, isUserNameSubmitSuccess: false })
    try {
      const patch = await this.axios.patch(profileEndpointPath, { username: username.input })
      const profile = patch.data
      this.state.update({ isUserNameSubmitting: false, isUserNameSubmitSuccess: true })
      this.profiles.set(profile)
      this.store.engagement.checkWhatsNew()
    } catch (err) {
      this.state.update({ isUserNameSubmitting: false })
    }
  }

  resetUsernameSuccess = () => {
    this.state.update({ isUserNameSubmitSuccess: false })
  }

  updateMinecraftUsername = async (minecraftUsername: FormValues): Promise<void> => {
    const current = this.currentProfile
    if (current === undefined) {
      return
    }
    this.state.update({ isMinecraftUserNameSubmitting: true, isMinecraftUserNameSubmitSuccess: false })
    try {
      const patch = await this.axios.patch(profileEndpointPath, {
        extensions:
          current.extensions === undefined
            ? {
                minecraftUsername: minecraftUsername.input,
              }
            : {
                ...current.extensions,
                minecraftUsername: minecraftUsername.input,
              },
      })
      const profile = patch.data
      this.state.update({ isMinecraftUserNameSubmitting: false, isMinecraftUserNameSubmitSuccess: true })
      this.profiles.set(profile)
      this.store.engagement.checkWhatsNew()
    } catch (error) {
      this.store.notifications.sendNotification({
        category: NotificationMessageCategory.FurtherActionRequired,
        title: 'Unable to update your Minecraft Username',
        message: 'Please try again.',
        autoClose: false,
        type: 'error',
      })

      this.state.update({ isMinecraftUserNameSubmitting: false })
    }
  }

  resetMinecraftUsernameSuccess = () => {
    this.state.update({ isMinecraftUserNameSubmitSuccess: false })
  }

  connectExternalAccountProvider = () => {
    const urlSearchParams = new URLSearchParams(window.location.search)
    const externalAuthProviderLoginStatus = urlSearchParams.get('external-login-status')
    const externalAuthProviderLoginAction = urlSearchParams.get('external-login-action')

    this.store.routing.replace('/account/summary')

    if (
      externalAuthProviderLoginAction === ExternalAuthProviderLoginAction.OneTimeCodeFlow ||
      externalAuthProviderLoginAction === ExternalAuthProviderLoginAction.WithMessageConfirmation
    ) {
      if (externalAuthProviderLoginStatus === ExternalAuthProviderLoginStatus.Success) {
        this.store.notifications.sendNotification({
          category: NotificationMessageCategory.Success,
          title: 'Your Accounts were Successfully Linked',
          message: 'Your Salad account and Google account are now connected.',
        })
      }

      if (externalAuthProviderLoginStatus === ExternalAuthProviderLoginStatus.Failed) {
        this.store.notifications.sendNotification({
          category: NotificationMessageCategory.Error,
          title: 'Account Connection Failed',
          message: `We're having trouble connecting your account. Please try again.`,
          type: 'error',
        })
      }
    }
  }

  loadGoogleAccountConnection = async (): Promise<void> => {
    try {
      this.state.update({ isLoadConnectedGoogleAccountEmailError: false })
      this.connectExternalAccountProvider()

      const authProviderConnections: AxiosResponse<ExternalAuthProvider[]> = await this.axios.get(
        authenticationExternalEndpointPath,
      )

      if (authProviderConnections.data?.length > 0) {
        const connectedGoogleAccount = authProviderConnections.data.find(
          (externalAuthProvider) => externalAuthProvider?.loginProvider === 'Google',
        )

        if (connectedGoogleAccount) {
          this.state.update({ connectedGoogleAccountEmail: connectedGoogleAccount.email })
        }
      }
    } catch (err) {
      this.state.update({ isLoadConnectedGoogleAccountEmailError: true })
      this.store.notifications.sendNotification({
        category: NotificationMessageCategory.Error,
        title: 'Unable to fetch connected Google Account.',
        message: 'Please try to refresh the page.',
        type: 'error',
      })
    }
  }

  setProtectRewardsRedemption = async (isProtectRewardsRedemptionEnabled: boolean): Promise<void> => {
    const profile = this.currentProfile
    if (profile) {
      // A copy, so the components showing the profile see the change, as they saw the store's field change.
      this.profiles.set({ ...profile, redemptionTfaEnabled: isProtectRewardsRedemptionEnabled })
    }

    if (this.state.get().protectRewardsRedemptionStatus === 'loading') {
      return
    }

    if (this.protectRewardsRedemptionStatusTimeout) {
      this.state.update({ protectRewardsRedemptionStatus: 'unknown' })
      clearTimeout(this.protectRewardsRedemptionStatusTimeout)
    }

    try {
      this.state.update({ protectRewardsRedemptionStatus: 'loading' })
      await this.axios.post(protectRewardsRedemptionEndpointPath, {
        redemptionsTfaEnabled: isProtectRewardsRedemptionEnabled,
      })
      void this.loadProfile()
      this.state.update({ protectRewardsRedemptionStatus: 'success' })
    } catch (error) {
      void this.loadProfile()
      this.state.update({ protectRewardsRedemptionStatus: 'failure' })
      console.error('ProfileStore -> setProtectRewardsRedemption: ', error)
    }

    this.protectRewardsRedemptionStatusTimeout = setTimeout(() => {
      this.state.update({ protectRewardsRedemptionStatus: 'unknown' })
    }, 6000)
  }

  setProtectRewardsRedemptionStatus = (protectRewardsRedemptionStatus: ProtectRewardsRedemptionStatus) => {
    this.state.update({ protectRewardsRedemptionStatus })
  }

  /**
   * Forgets the selected avatar and connected Google account of the user who signed out, so the next user never sees
   * them. Sign-out resets the profile's query (src/app/forget-user.ts).
   */
  resetUserData = () => {
    this.state.update({
      currentSelectedAvatar: undefined,
      selectedAvatar: undefined,
      connectedGoogleAccountEmail: undefined,
      protectRewardsRedemptionStatus: 'unknown',
    })
  }
}
