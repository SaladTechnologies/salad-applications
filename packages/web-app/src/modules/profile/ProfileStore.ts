import SaladDefaultAvatarSrc from '@saladtechnologies/garden-components/lib/components/Avatar/assets/SaladAvatar.png'
import { AxiosInstance, AxiosResponse } from 'axios'
import { action, computed, flow, observable } from 'mobx'
import { RootStore } from '../../Store'
import { FormValues } from '../account-views/account-views/components/'
import { NotificationMessageCategory } from '../notifications/models'
import { Avatar, payPalResponse, Profile } from './models'

const SaladDefaultAvatar: Avatar = {
  name: 'Default',
  description: 'Salad Default Avatar',
  imageUrl: SaladDefaultAvatarSrc,
  id: '00000000-0000-0000-0000-000000000000',
}

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
  public isPayPalIdDisconnectLoading: boolean = false

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
      let res: AxiosResponse<payPalResponse> = yield this.axios.get('/api/v2/paypal-account') as payPalResponse
      this.payPalId = res?.data?.email
    } catch (err) {
      console.log(err)
    }
  })

  @action.bound
  disconnectPayPalId = flow(function* (this: ProfileStore) {
    this.isPayPalIdDisconnectLoading = true
    try {
      let res: AxiosResponse<payPalResponse> = yield this.axios.delete('/api/v2/paypal-account')
      this.payPalId = res?.data?.email
      this.isPayPalIdDisconnectLoading = false
      this.loadPayPalId()
    } catch (err) {
      console.log(err)
      this.isPayPalIdDisconnectLoading = false
    }
  })
}
