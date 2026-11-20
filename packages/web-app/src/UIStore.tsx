import { action } from 'mobx'
import type { RootStore } from './Store'

export class UIStore {
  constructor(private readonly store: RootStore) {}

  @action
  showModal = (url: string) => {
    this.store.routing.push(url)
  }

  /** Closes the modal page: back to where the user came from, or to the fallback when they opened it directly. */
  @action
  hideModal = (fallback: string, trackModalClosed?: boolean) => {
    if (trackModalClosed) {
      this.store.analytics.trackButtonClicked('modal_close_button', 'Modal Close Button', 'enabled')
    }

    this.store.routing.goBackOr(fallback)
  }
}
