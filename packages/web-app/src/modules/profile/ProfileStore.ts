import { AxiosInstance } from 'axios'
import { action, flow, observable } from 'mobx'
import { RootStore } from '../../Store'
import { NotificationMessageCategory } from '../notifications/models'
import { Avatar, Profile } from './models'
import { FormValues} from '../account-views/account-views/components/'
export class ProfileStore {
  @observable
  public currentProfile?: Profile

  @observable
  public isUpdating: boolean = false

  @observable
  public isFirstLogin: boolean = false

  @observable
  public isLoading: boolean = false

  @observable
  public avatars?: Avatar[] = []

  @observable
  public selectedAvatar?: Avatar

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {}

  @action.bound
  loadProfile = flow(function* (this: ProfileStore) {
    console.log('Loading the user profile')
    // debugger;
    this.isLoading = true
    try {
      let profile = yield this.axios.get('/api/v1/profile')
      this.currentProfile = profile.data
    } catch (err) {
      console.error('Profile error: ', err)
      this.currentProfile = undefined
      this.store.routing.replace('/profile-error')
    } finally {
      this.isLoading = false
    }
    return this.currentProfile
  })

  @action.bound
  loadAvatars = flow(function* (this: ProfileStore) {
    console.log('Loading avatars')
    // debugger;

    this.isLoading = true
    try {
      let avatar = yield this.axios.get('/api/v2/avatars')
      this.avatars = avatar.data
    } catch (err) {
      console.error('Avatars error: ', err)
      this.avatars = undefined
      // this.store.routing.replace('/avatars-error')
    } finally {
      this.isLoading = false
    }
    return this.avatars
  })

  @action.bound
  loadSelectedAvatar = flow(function* (this: ProfileStore) {
    console.log('Loading selected avatar')

    this.isLoading = true
    try {
      let selectedAvatar = yield this.axios.get('/api/v2/avatars/selected')
      console.log(selectedAvatar, 'SELECTED AVATAR')
      this.selectedAvatar = selectedAvatar.data
    } catch (err) {
      console.error('selectedAvatars error: ', err)
      this.selectedAvatar = undefined
    } finally {
      this.isLoading = false
    }
    return this.selectedAvatar
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

    this.isUpdating = true
    try {
      const response = yield this.axios.patch('/api/v1/profile', {
        lastSeenApplicationVersion: whatsNewVersion,
      })

      this.currentProfile = response.data
      this.store.analytics.trackWhatsNew(whatsNewVersion)
    } finally {
      this.isUpdating = false
    }
  })

  @action.bound
  updateUsername = flow(function* (this: ProfileStore, username: FormValues) {
    if (this.currentProfile === undefined) return


    this.isUpdating = true

    try {
      let patch = yield this.axios.patch('/api/v1/profile', { username: username.input })
      let profile = patch.data

      this.currentProfile = profile
    } finally {
      this.isUpdating = false
      // this.store.routing.replace('/')
    }
  })

  @action.bound
  updateMinecraftUsername = flow(function* (this: ProfileStore, minecraftUsername: FormValues) {

    if (this.currentProfile === undefined) {
      return
    }

    this.isUpdating = true

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

      this.currentProfile = profile
    } catch (error) {
      this.store.notifications.sendNotification({
        category: NotificationMessageCategory.FurtherActionRequired,
        title: 'Unable to update your Minecraft Username',
        message: 'Please try again.',
        autoClose: false,
        type: 'error',
      })
    } finally {
      this.isUpdating = false
    }
  })
}
