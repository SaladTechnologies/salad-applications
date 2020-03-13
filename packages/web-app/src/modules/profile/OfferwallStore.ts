import { observable, action } from 'mobx'
// import { RootStore } from '../../Store'
import * as Storage from '../../Storage'

const OFFERWALL = 'OFFERWALL'

export class OfferwallStore {
  @observable
  public offerwall: boolean = false

  constructor() {
    const checkOfferwall = (Storage.getOrSetDefault(OFFERWALL, 'false') === 'true')
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
  }

  @action
  setOfferwall = (enabled: boolean) => {
    this.offerwall = enabled
    Storage.setItem(OFFERWALL, enabled ? 'true' : 'false')
  }
}