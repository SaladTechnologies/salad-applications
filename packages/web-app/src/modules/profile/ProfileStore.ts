import { observable, action, flow, computed } from 'mobx'
import { Profile } from './models'
import { Config } from '../../config'
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

  @computed
  public get showWhatsNew(): boolean {
    const show =
      this.currentProfile !== undefined && this.currentProfile.lastSeenApplicationVersion !== Config.whatsNewVersion

    return show
  }

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {}

  @action.bound
  loadProfile = flow(function*(this: ProfileStore) {
    console.log('Loading the user profile')

    this.isLoading = true
    try {
      let profile = yield this.axios.get('profile')
      this.currentProfile = profile.data
      //TODO: Move the routing logic to the onLogin function so we can load all the data before showing the app
      this.store.routing.replace('/')

      //Check to see if we should add the What's New notification
      if (this.showWhatsNew) {
        this.store.notifications.sendNotification({
          title: 'Salad was Updated',
          message: 'Something new just came out from the kitchen. Click here to learn more.',
          autoClose: false,
          onClick: () => this.store.ui.showModal('/whats-new'),
        })
      }
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
  setWhatsNewViewed = flow(function*(this: ProfileStore) {
    if (this.currentProfile === undefined) return

    this.isUpdating = true

    try {
      let patch = yield this.axios.patch('profile', {
        lastSeenApplicationVersion: Config.whatsNewVersion,
      })
      let profile = patch.data

      this.currentProfile = profile

      this.store.analytics.trackWhatsNew(Config.whatsNewVersion)
    } finally {
      this.isUpdating = false
      this.store.routing.goBack()
    }
  })

  @action.bound
  updateUsername = flow(function*(this: ProfileStore, username: string) {
    if (this.currentProfile === undefined) return

    this.isUpdating = true

    try {
      let patch = yield this.axios.patch('profile', { username: username })
      let profile = patch.data

      this.currentProfile = profile
    } finally {
      this.isUpdating = false
      // this.store.routing.replace('/')
    }
  })

  sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}
