import type { AxiosInstance } from 'axios'
import { action, flow, observable } from 'mobx'
import { onceWhen } from '../../app/once-when.ts'
import type { RootStore } from '../../Store'
import { NotificationMessageCategory } from '../notifications/models'
import type { ChangelogMetadata } from './models/ChangelogMetadata'

export class EngagementStore {
  public static readonly CHANGELOG_URL = 'https://salad.com/whats-new'

  @observable
  public whatsNewVersion?: string

  /**
   * Whether the profile last saw a different version than the changelog's. The profile is not a MobX value: read it
   * now.
   */
  public get showWhatsNew(): boolean {
    const show =
      this.whatsNewVersion !== undefined &&
      this.store?.profile?.currentProfile !== undefined &&
      this.store?.profile?.currentProfile.lastSeenApplicationVersion !== this.whatsNewVersion
    return show
  }

  /**
   * Shows the "Salad was Updated" toast the first time the changelog version, sign-in, and the profile are all known,
   * when the profile's last seen version is older, and never again. It ran as an `autorun` on those three; now
   * `checkWhatsNew` runs it right after each of them changes: the changelog load here, the session change in the root
   * store, and the profile's loads in the profile store.
   */
  private readonly showWhatsNewOnce = onceWhen(
    () =>
      this.whatsNewVersion !== undefined && !!this.store.auth.isAuthenticated && !!this.store.profile?.currentProfile,
    () => {
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

        this.store.profile.setWhatsNewViewed()
      }
    },
  )

  constructor(
    private readonly store: RootStore,
    private readonly axios: AxiosInstance,
  ) {
    this.loadChangelogMetadata()
  }

  /** Shows the "Salad was Updated" toast if it is due and has not been shown: see `showWhatsNewOnce`. */
  public checkWhatsNew = (): void => {
    this.showWhatsNewOnce()
  }

  @action.bound
  loadChangelogMetadata = flow(function* (this: EngagementStore) {
    try {
      const response = yield this.axios.get<ChangelogMetadata>('/api/v2/changelog')
      this.whatsNewVersion = (response.data as ChangelogMetadata).lastUpdated
      this.checkWhatsNew()
    } catch (err) {
      console.log(err)
    }
  })
}
