import { AxiosInstance } from 'axios'
import { action, autorun, computed, flow, observable } from 'mobx'
import { RootStore } from '../../Store'
import { NotificationMessageCategory } from '../notifications/models'
import { ChangelogMetadata } from './models/ChangelogMetadata'

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

      if (!this.store.machine.currentMachine) {
        return
      }

      if (this.store.saladBowl.canRun && this.store.xp.currentXp <= 10) {
        //Link to the mining page
        this.store.notifications.sendNotification({
          category: NotificationMessageCategory.Incentive,
          title: `Redemptions and Rewards Await`,
          message: `Your machine has the chops, but you haven't gotten chopping yet! Click here for a quick tutorial on how to mine with Salad and start earning now!`,
          autoClose: false,
          onClick: () => this.store.routing.push('/earn/mine'),
        })
      }

      //Incompatible machine and offerwalls are disabled
      else if (!this.store.saladBowl.canRun && this.store.balance.lifetimeBalance === 0) {
        //Link to offerwall page
        this.store.notifications.sendNotification({
          category: NotificationMessageCategory.Incentive,
          title: `Can't Chop? Try Offerwalls!`,
          message: `Not every machine can chop Salad - but we've got good news for you. Click here to check out our offerwalls, where you can perform easy tasks and start earning now!`,
          autoClose: false,
          onClick: () => this.store.routing.push('/earn/offerwall'),
        })
      }
      //Remind users to mine
      else if (this.store.saladBowl.canRun) {
        this.store.notifications.sendNotification({
          category: NotificationMessageCategory.Incentive,
          title: 'Time to get Chopping',
          message: 'Welcome back to the kitchen. Click here to get chopping again.',
          autoClose: false,
          onClick: () => this.store.ui.showModal('/earn/mine'),
        })
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
