import { action } from 'mobx'
import { RootStore } from './Store'

export class UIStore {
  constructor(private readonly store: RootStore) {}

  @action
  showModal = (url: string) => {
    this.store.routing.push(url)
  }

  @action
  hideModal = () => {
    this.store.routing.replace('/')
  }

  @action
  openNewBug = () => {
    const openLink = (url: string) => {
      window.open(url, '_blank')
    }

    openLink('https://salad.zendesk.com/hc/en-us/requests/new')
  }
}
