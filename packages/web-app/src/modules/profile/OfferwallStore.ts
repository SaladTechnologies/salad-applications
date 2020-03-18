import { observable, action } from 'mobx'
import * as Storage from '../../Storage'
import { RootStore } from '../../Store'

const OFFERWALL = 'OFFERWALL'

export class OfferwallStore {
  @observable
  public offerwall: boolean = false

  constructor(private readonly store: RootStore) {
    const checkOfferwall = Storage.getOrSetDefault(OFFERWALL, 'false') === 'true'
    this.setOfferwall(checkOfferwall)
  }

  @action
  toggleOfferwall = () => {
    console.log('>>>>> [[OfferwallStore] toggleOfferwall] this.offerwall: ', this.offerwall)

    if (this.offerwall) {
      this.setOfferwall(false)
    } else {
      this.setOfferwall(true)
    }

    this.store.analytics.trackOfferwallStatus(this.offerwall)
  }

  @action
  setOfferwall = (enabled: boolean) => {
    this.offerwall = enabled
    Storage.setItem(OFFERWALL, enabled ? 'true' : 'false')
  }
}
