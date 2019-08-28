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

  showProfilePage = () => {
    this.showModal('/profile')
    this.store.analytics.track('Viewed Profile')
  }

  showSettingsPage = () => {
    this.showModal('/settings/windows-settings')
    this.store.analytics.track('Viewed Settings')
  }

  showReferralsPage = () => {
    this.showModal('/settings/referrals')
    this.store.analytics.track('Referrals')
  }
}
