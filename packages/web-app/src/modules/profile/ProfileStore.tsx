import SaladDefaultAvatarSrc from '@saladtechnologies/garden-components/lib/components/Avatar/assets/SaladAvatar.png'
import type { AxiosInstance, AxiosResponse } from 'axios'
import { action, computed, flow, observable } from 'mobx'
import * as Storage from '../../Storage'
import type { RootStore } from '../../Store'
import type { FormValues } from '../account-views/account-views/components/'
import { NotificationMessageCategory } from '../notifications/models'
import {
  ExternalAuthProviderLoginAction,
  ExternalAuthProviderLoginStatus,
  type Avatar,
  type ExternalAuthProvider,
  type Profile,
  type payPalResponse,
} from './models'

const SaladDefaultAvatar: Avatar = {
  name: 'Default',
  description: 'Salad Default Avatar',
  imageUrl: SaladDefaultAvatarSrc,
  id: '00000000-0000-0000-0000-000000000000',
}
const installReminderFeatureReleaseDate = new Date('2023-12-21T17:10:47.324Z')
const IS_INSTALL_REMINDER_CLOSED_STORAGE_KEY = 'IS_INSTALL_REMINDER_CLOSED'

let timeoutId: NodeJS.Timeout

export class ProfileStore {
  @observable
  public currentSelectedAvatar?: string

  @observable
  public avatarError?: {
    avatar: string
    message: string
  }

  @observable
  public avatars?: Avatar[]

  @observable
  public currentProfile?: Profile

  @observable
  public novuSignature?: string

  @observable
  public submittingAvatar?: string

  @observable
  public selectedAvatar?: string

  @observable
  public isUserNameSubmitting: boolean = false

  @observable
  public isUserNameSubmitSuccess: boolean = false

  @observable
  public isMinecraftUserNameSubmitting: boolean = false

  @observable
  public isMinecraftUserNameSubmitSuccess: boolean = false

  @computed
  get profileAvatar(): Avatar | undefined {
    return this.avatars?.find((avatar) => avatar.id === this.currentSelectedAvatar)
  }

  @observable
  public payPalId?: string

  @observable
  public connectedGoogleAccountEmail?: string

  @observable
  public isLoadConnectedGoogleAccountEmailError: boolean = false

  @observable
  public isPayPalIdDisconnectLoading: boolean = false

  @observable
  public isInstallReminderClosed: boolean = Storage.getItem(IS_INSTALL_REMINDER_CLOSED_STORAGE_KEY) === 'true'

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {}

  @computed
  public get withInstallReminder(): boolean {
    const isProfileCreatedAfterInstallReminderReleaseDate = this.currentProfile?.createdAt
      ? new Date(this.currentProfile?.createdAt) > installReminderFeatureReleaseDate
      : false

    return (
      isProfileCreatedAfterInstallReminderReleaseDate &&
      !this.isInstallReminderClosed &&
      !this.currentProfile?.saladBowlFirstLoginAt &&
      !!this.store.auth.isAuthenticated
    )
  }

  @action
  setProfileData = (profileData: Profile) => {
    this.currentProfile = profileData
  }

  @action
  setIsInstallReminderClosed = (isInstallReminderClosed: boolean) => {
    this.isInstallReminderClosed = isInstallReminderClosed
    Storage.setItem(IS_INSTALL_REMINDER_CLOSED_STORAGE_KEY, JSON.stringify(isInstallReminderClosed))
  }

  @action.bound
  loadProfile = flow(function* (this: ProfileStore) {
    try {
      let profile = yield this.axios.get('/api/v1/profile')
      this.currentProfile = profile.data
      this.store.errorBoundary.resetErrorBoundary()
    } catch (err) {
      this.currentProfile = undefined
      this.store.errorBoundary.showErrorBoundary(new Error(`An error occurred: ${err}`))
    }
    return this.currentProfile
  })

  @action.bound
  loadNovuSignature = flow(function* (this: ProfileStore) {
    try {
      if (this.novuSignature) {
        return
      }

      let novuSignature = yield this.axios.post('/api/v2/novu-signatures')
      this.novuSignature = novuSignature.data.signature
    } catch (_error) {
      console.error('Failed to Load Novu Signature')
    }
  })

  @action.bound
  loadAvatars = flow(function* (this: ProfileStore) {
    try {
      let avatar = yield this.axios.get('/api/v2/avatars')
      this.avatars = avatar.data
      this.avatars?.unshift(SaladDefaultAvatar)
    } catch (err) {}
  })

  @action.bound
  loadSelectedAvatar = flow(function* (this: ProfileStore) {
    try {
      let selectedAvatar = yield this.axios.get('/api/v2/avatars/selected')
      this.currentSelectedAvatar = this.selectedAvatar = selectedAvatar.data?.id
    } catch (err) {
      this.currentSelectedAvatar = this.selectedAvatar = SaladDefaultAvatar.id
    }
  })

  @action.bound
  setWhatsNewViewed = flow(function* (this: ProfileStore) {
    if (this.currentProfile === undefined) {
      return
    }

    const whatsNewVersion = this.store.engagement.whatsNewVersion
    if (whatsNewVersion === undefined) {
      return
    }

    try {
      const response = yield this.axios.patch('/api/v1/profile', {
        lastSeenApplicationVersion: whatsNewVersion,
      })

      this.currentProfile = response.data
      this.store.analytics.trackWhatsNew(whatsNewVersion)
    } catch (err) {}
  })

  @action.bound
  selectAvatar = flow(function* (this: ProfileStore, id: string) {
    if (this.submittingAvatar !== undefined || !this.avatars || this.selectedAvatar === id) {
      return
    }
    this.avatarError = undefined
    let avatarId: string | undefined
    if (id === '00000000-0000-0000-0000-000000000000') {
      this.selectedAvatar = this.submittingAvatar = SaladDefaultAvatar.id
      avatarId = '00000000-0000-0000-0000-000000000000'
    } else {
      this.selectedAvatar = this.submittingAvatar = this.avatars.find((avatar) => avatar.id === id)?.id
      avatarId = id
    }
    try {
      let patch = yield this.axios.patch('/api/v2/avatars/selected', { avatarId })
      this.currentSelectedAvatar = this.selectedAvatar = patch.data?.id
    } catch (err) {
      this.avatarError = {
        avatar: id,
        message: 'Unable to select avatar',
      }
      this.selectedAvatar = this.currentSelectedAvatar
    } finally {
      this.submittingAvatar = undefined
    }
  })

  @action
  clearAvatarError = () => {
    this.avatarError = undefined
  }

  @action.bound
  updateUsername = flow(function* (this: ProfileStore, username: FormValues) {
    if (this.currentProfile === undefined) return
    this.isUserNameSubmitting = true
    this.isUserNameSubmitSuccess = false
    try {
      let patch = yield this.axios.patch('/api/v1/profile', { username: username.input })
      let profile = patch.data
      this.isUserNameSubmitting = false
      this.isUserNameSubmitSuccess = true
      this.currentProfile = profile
    } catch (err) {
      this.isUserNameSubmitting = false
    }
  })

  @action.bound
  resetUsernameSuccess = () => {
    this.isUserNameSubmitSuccess = false
  }

  @action.bound
  updateMinecraftUsername = flow(function* (this: ProfileStore, minecraftUsername: FormValues) {
    if (this.currentProfile === undefined) {
      return
    }
    this.isMinecraftUserNameSubmitting = true
    this.isMinecraftUserNameSubmitSuccess = false
    try {
      let patch = yield this.axios.patch('/api/v1/profile', {
        extensions:
          this.currentProfile.extensions === undefined
            ? {
                minecraftUsername: minecraftUsername.input,
              }
            : {
                ...this.currentProfile.extensions,
                minecraftUsername: minecraftUsername.input,
              },
      })
      let profile = patch.data
      this.isMinecraftUserNameSubmitting = false
      this.isMinecraftUserNameSubmitSuccess = true
      this.currentProfile = profile
    } catch (error) {
      this.store.notifications.sendNotification({
        category: NotificationMessageCategory.FurtherActionRequired,
        title: 'Unable to update your Minecraft Username',
        message: 'Please try again.',
        autoClose: false,
        type: 'error',
      })

      this.isMinecraftUserNameSubmitting = false
    }
  })

  @action.bound
  resetMinecraftUsernameSuccess = () => {
    this.isMinecraftUserNameSubmitSuccess = false
  }

  @action.bound
  loadPayPalId = flow(function* (this: ProfileStore) {
    try {
      let res: AxiosResponse<payPalResponse> = yield this.axios.get('/api/v2/paypal/users') as payPalResponse
      this.payPalId = res?.data?.email
    } catch (err) {
      console.log(err)
    }
  })

  checkPayPalIdWithInterval = async (): Promise<void> => {
    let payPalLoadRetries = 0
    const maxPaypalLoadRetries = 50

    const loadPayPalIdWithRetry = async () => {
      try {
        if (payPalLoadRetries >= maxPaypalLoadRetries || this.payPalId) {
          clearTimeout(timeoutId)
          return
        }

        await this.loadPayPalId()

        if (!this.payPalId) {
          payPalLoadRetries++
          timeoutId = setTimeout(loadPayPalIdWithRetry, 5000)
        } else {
          clearTimeout(timeoutId)
          return
        }
      } catch (error) {
        console.error('ProfileStore -> checkPayPalIdWithInterval: ', error)
      }
    }

    clearTimeout(timeoutId)
    loadPayPalIdWithRetry()
  }

  @action.bound
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
        this.store.auth.successfulExternalProviderConnection()
      }

      if (externalAuthProviderLoginStatus === ExternalAuthProviderLoginStatus.Failed) {
        this.store.auth.failedExternalProviderConnection()
      }
    }
  }

  @action.bound
  loadGoogleAccountConnection = flow(function* (this: ProfileStore) {
    try {
      this.isLoadConnectedGoogleAccountEmailError = false
      this.connectExternalAccountProvider()

      const authProviderConnections: AxiosResponse<ExternalAuthProvider[]> = yield this.axios.get(
        '/api/v2/authentication/external',
      )

      if (authProviderConnections.data?.length > 0) {
        const connectedGoogleAccount = authProviderConnections.data.find(
          (externalAuthProvider) => externalAuthProvider?.loginProvider === 'Google',
        )

        if (connectedGoogleAccount) {
          this.connectedGoogleAccountEmail = connectedGoogleAccount.email
        }
      }
    } catch (err) {
      this.isLoadConnectedGoogleAccountEmailError = true
      this.store.notifications.sendNotification({
        category: NotificationMessageCategory.Error,
        title: 'Unable to fetch connected Google Account.',
        message: 'Please try to refresh the page.',
        type: 'error',
      })
    }
  })

  @action.bound
  disconnectPayPalId = flow(function* (this: ProfileStore) {
    this.isPayPalIdDisconnectLoading = true
    try {
      let res: AxiosResponse<payPalResponse> = yield this.axios.delete('/api/v2/paypal/users')
      this.payPalId = res?.data?.email
      this.isPayPalIdDisconnectLoading = false
      this.loadPayPalId()
    } catch (err) {
      console.log(err)
      this.isPayPalIdDisconnectLoading = false
    }
  })
}
