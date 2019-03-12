import { action, observable } from 'mobx'
import { RootStore } from './Store'

export class UIStore {
  @observable
  public onboarding: Onboarding = new Onboarding()

  constructor(private readonly store: RootStore) {
    // this.onboarding
  }

  @action
  showModal = (url: string) => {
    this.store.routing.push(url)
  }

  @action
  hideModal = () => {
    this.store.routing.replace('/')
  }
}

export class Onboarding {
  @action
  nextPage = () => {
    console.log('next page')
  }
}
