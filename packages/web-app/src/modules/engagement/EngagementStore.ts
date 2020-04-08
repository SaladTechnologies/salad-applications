import { computed, autorun } from 'mobx'
import { RootStore } from '../../Store'
import { Config } from '../../config'

export class EngagementStore {
  @computed
  public get showWhatsNew(): boolean {
    const show =
      this.store?.profile?.currentProfile !== undefined &&
      this.store?.profile?.currentProfile.lastSeenApplicationVersion !== Config.whatsNewVersion

    return show
  }

  constructor(private readonly store: RootStore) {
    autorun(() => {
      if (!this.store.auth.isAuth) {
        return
      }
      if (this.store.saladBowl.canRun && this.store.xp.currentXp <= 10) {
        //Link to the mining page
        this.store.notifications.sendNotification({
          title: `Redemptions and Rewards Await`,
          message: `Your machine has the chops, but you haven't gotten chopping yet! Click here for a quick tutorial on how to mine with Salad and start earning now!`,
          autoClose: false,
          onClick: () => this.store.routing.push('/earn/mine'),
        })
      }
      //Incompatible machine and offerwalls are disabled
      else if (!this.store.saladBowl.canRun && !this.store.offerwall.offerwall) {
        //Link to offerwall page
        this.store.notifications.sendNotification({
          title: `Can't Chop? Try Offerwalls!`,
          message: `Not every machine can chop Salad - but we've got good news for you. Click here to check out our offerwalls, where you can perform easy tasks and start earning now!`,
          autoClose: false,
          onClick: () => this.store.routing.push('/earn/offerwall'),
        })
      }
      //Check to see if we should add the What's New notification
      else if (this.showWhatsNew) {
        this.store.notifications.sendNotification({
          title: 'Salad was Updated',
          message: 'Something new just came out from the kitchen. Click here to learn more.',
          autoClose: false,
          onClick: () => this.store.ui.showModal('/whats-new'),
        })
      }
    })
  }
}
