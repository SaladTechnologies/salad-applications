import type { AxiosInstance } from 'axios'
import { action, autorun, computed, flow, observable } from 'mobx'
import type { RootStore } from '../../Store'
import { NotificationMessageCategory } from '../notifications/models'
import type { ChangelogMetadata } from './models/ChangelogMetadata'

export class EngagementStore {
  public static readonly CHANGELOG_URL = 'https://salad.com/whats-new'

  @observable
  public whatsNewVersion?: string

  @computed
  public get showWhatsNew(): boolean {
    const show =
      this.whatsNewVersion !== undefined &&
      this.store?.profile?.currentProfile !== undefined &&
      this.store?.profile?.currentProfile.lastSeenApplicationVersion !== this.whatsNewVersion
    return show
  }

  /** A flag indicating if the initial notification has already been sent */
  private showedInitialNotification = false

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {
    this.loadChangelogMetadata()
    autorun(() => {
      if (this.showedInitialNotification) {
        return
      }

      if (this.whatsNewVersion === undefined) {
        return
      }

      if (!this.store.auth.isAuthenticated) {
        return
      }

      if (!this.store?.profile?.currentProfile) {
        return
      }

      this.showedInitialNotification = true

      //Check to see if we should add the What's New notification
      if (this.showWhatsNew) {
        this.store.notifications.sendNotification({
          category: NotificationMessageCategory.AppUpdate,
          title: 'Salad was Updated',
          message: 'Something new just came out from the kitchen. Click here to learn more.',
          autoClose: false,
          onClick: () => {
            window.open(EngagementStore.CHANGELOG_URL, '_blank')
          },
        })

        store.profile.setWhatsNewViewed()
        return
      }
    })
  }

  @action.bound
  loadChangelogMetadata = flow(function* (this: EngagementStore) {
    try {
      const response = yield this.axios.get<ChangelogMetadata>('/api/v2/changelog')
      this.whatsNewVersion = (response.data as ChangelogMetadata).lastUpdated
    } catch (err) {
      console.log(err)
    }
  })
}
