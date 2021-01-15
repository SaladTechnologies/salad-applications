import { AxiosInstance } from 'axios'
import { action, flow, observable } from 'mobx'
import { RootStore } from '../../Store'
import { Profile } from './models'

export class ProfileStore {
  @observable
  public currentProfile?: Profile

  @observable
  public isUpdating: boolean = false

  @observable
  public isFirstLogin: boolean = false

  @observable
  public isLoading: boolean = false

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {}

  @action.bound
  loadProfile = flow(function* (this: ProfileStore) {
    console.log('Loading the user profile')

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
  updateUsername = flow(function* (this: ProfileStore, username: string) {
    if (this.currentProfile === undefined) return

    this.isUpdating = true

    try {
      let patch = yield this.axios.patch('/api/v1/profile', { username: username })
      let profile = patch.data

      this.currentProfile = profile
    } finally {
      this.isUpdating = false
      // this.store.routing.replace('/')
    }
  })

  @action.bound
  updateMinecraftUsername = flow(function* (this: ProfileStore, minecraftUsername: string) {
    if (this.currentProfile === undefined) {
      return
    }

    this.isUpdating = true

    try {
      let patch = yield this.axios.patch('/api/v1/profile', {
        extensions:
          this.currentProfile.extensions === undefined
            ? {
                minecraftUsername: minecraftUsername,
              }
            : {
                ...this.currentProfile.extensions,
                minecraftUsername: minecraftUsername,
              },
      })
      let profile = patch.data

      this.currentProfile = profile
    } catch (error) {
      this.store.notifications.sendNotification({
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
