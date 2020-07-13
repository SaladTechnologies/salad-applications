import { autorun, computed } from 'mobx'
import { config } from '../../config'
import { RootStore } from '../../Store'
import { HeroType } from './models/HeroType'

export class EngagementStore {
  @computed
  public get showWhatsNew(): boolean {
    const show =
      this.store?.profile?.currentProfile !== undefined &&
      this.store?.profile?.currentProfile.lastSeenApplicationVersion !== config.whatsNewVersion
    return show
  }

  @computed
  public get heroes(): Map<number, HeroType> {
    const heroes = new Map<number, HeroType>()

    heroes.set(2, HeroType.Mining)
    heroes.set(4, HeroType.Offerwall)

    if (!this.store.referral.currentReferral) {
      heroes.set(6, HeroType.ReferralEntry)
    }

    return heroes
  }

  /** A flag indicating if the initial notification has already been sent */
  private showedInitialNotification = false

  constructor(private readonly store: RootStore) {
    autorun(() => {
      if (!this.store.auth.isAuthenticated) {
        return
      }

      if (this.showedInitialNotification) {
        return
      }

      if (!this.store?.profile?.currentProfile) {
        return
      }

      this.showedInitialNotification = true

      //Check to see if we should add the What's New notification
      if (this.showWhatsNew) {
        this.store.notifications.sendNotification({
          title: 'Salad was Updated',
          message: 'Something new just came out from the kitchen. Click here to learn more.',
          autoClose: false,
          onClick: () => this.store.ui.showModal('/whats-new'),
        })

        return
      }

      if (!this.store.machine.currentMachine) {
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
      else if (!this.store.saladBowl.canRun && this.store.balance.lifetimeBalance === 0) {
        //Link to offerwall page
        this.store.notifications.sendNotification({
          title: `Can't Chop? Try Offerwalls!`,
          message: `Not every machine can chop Salad - but we've got good news for you. Click here to check out our offerwalls, where you can perform easy tasks and start earning now!`,
          autoClose: false,
          onClick: () => this.store.routing.push('/earn/offerwall'),
        })
      }
      //Remind users to mine
      else if (this.store.saladBowl.canRun) {
        this.store.notifications.sendNotification({
          title: 'Time to get Chopping',
          message: 'Welcome back to the kitchen. Click here to get chopping again.',
          autoClose: false,
          onClick: () => this.store.ui.showModal('/earn/mine'),
        })
      }
    })
  }
}
