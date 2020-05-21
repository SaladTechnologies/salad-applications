import { observable, action, flow } from 'mobx'
import { Profile } from './models'
import { config } from '../../config'
import { RootStore } from '../../Store'
import { AxiosInstance } from 'axios'

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
    if (this.currentProfile === undefined) return

    this.isUpdating = true

    try {
      let patch = yield this.axios.patch('/api/v1/profile', {
        lastSeenApplicationVersion: config.whatsNewVersion,
      })
      let profile = patch.data

      this.currentProfile = profile

      this.store.analytics.trackWhatsNew(config.whatsNewVersion)
    } finally {
      this.isUpdating = false
      this.store.routing.goBack()
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
}
