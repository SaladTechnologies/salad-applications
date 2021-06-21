import { AxiosInstance } from 'axios'
import { action, flow, observable } from 'mobx'
import { RootStore } from '../../Store'
import { FormValues } from '../account-views/account-views/components/'
import { NotificationMessageCategory } from '../notifications/models'
import { Avatar, Profile } from './models'

export class ProfileStore {
  private currentSelectedAvatar?: Avatar

  @observable
  public avatarError?: {
    avatarId: string
    message: string
  }

  @observable
  public avatars?: Avatar[]

  @observable
  public currentProfile?: Profile

  @observable
  public isAvatarSubmitting: boolean = false

  @observable
  public selectedAvatar?: Avatar

  @observable
  public isUserNameSubmitting: boolean = false

  @observable
  public isUserNameSubmitSuccess: boolean = false

  @observable
  public isMinecraftUserNameSubmitting: boolean = false

  @observable
  public isMinecraftUserNameSubmitSuccess: boolean = false

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {}

  @action.bound
  loadProfile = flow(function* (this: ProfileStore) {
    try {
      let profile = yield this.axios.get('/api/v1/profile')
      this.currentProfile = profile.data
    } catch (err) {
      this.currentProfile = undefined
      this.store.routing.replace('/profile-error')
    }
    return this.currentProfile
  })

  @action.bound
  loadAvatars = flow(function* (this: ProfileStore) {
    try {
      let avatar = yield this.axios.get('/api/v2/avatars')
      this.avatars = avatar.data
    } catch (err) {}
  })

  @action.bound
  loadSelectedAvatar = flow(function* (this: ProfileStore) {
    try {
      let selectedAvatar = yield this.axios.get('/api/v2/avatars/selected')
      this.currentSelectedAvatar = this.selectedAvatar = selectedAvatar.data
    } catch (err) {}
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
    if (this.isAvatarSubmitting || !this.avatars || (this.selectedAvatar && this.selectedAvatar.id === id)) {
      return
    }
    this.avatarError = undefined
    this.isAvatarSubmitting = true
    this.selectedAvatar = this.avatars.find((avatar) => avatar.id === id)
    try {
      let patch = yield this.axios.patch('/api/v2/avatars/selected', { avatarId: id })
      this.currentSelectedAvatar = this.selectedAvatar = patch.data
    } catch (err) {
      this.avatarError = {
        avatarId: id,
        message: 'Unable to select avatar',
      }
      this.selectedAvatar = this.currentSelectedAvatar
    } finally {
      this.isAvatarSubmitting = false
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
}
