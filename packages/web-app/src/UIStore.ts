import { action } from 'mobx'
import { RootStore } from './Store'

export enum ErrorPageType {
  AntiVirus = 'antivirus',
  Cuda = 'cuda',
  Fallback = 'fallback',
  Network = 'network',
  NotCompatible = 'not-compatible',
  Unknown = 'unknown',
}

export class UIStore {
  constructor(private readonly store: RootStore) {}

  @action
  showModal = (url: string) => {
    this.store.routing.push(url)
  }

  @action
  hideModal = (trackModalClosed?: boolean) => {
    if (trackModalClosed) {
      this.store.analytics.trackButtonClicked('modal_close_button', 'Modal Close Button', 'enabled')
    }
    this.store.routing.replace('/')
  }

  @action
  showErrorPage = (type: ErrorPageType) => {
    switch (type) {
      case ErrorPageType.AntiVirus:
        this.showModal('/errors/anti-virus')
        break
      case ErrorPageType.Cuda:
        this.showModal('/errors/cuda')
        break
      case ErrorPageType.Fallback:
        this.showModal('/errors/fallback')
        this.store.analytics.trackErrorPageViewed(
          `Fallback ${this.store.saladBowl.gpuMiningEnabled ? 'GPU' : 'CPU'} Error`,
        )
        break
      case ErrorPageType.Network:
        this.showModal('/errors/network')
        break
      case ErrorPageType.NotCompatible:
        this.showModal('/errors/not-compatible')
        this.store.analytics.trackErrorPageViewed(
          `No Compatible ${this.store.saladBowl.gpuMiningEnabled ? 'GPU' : 'CPU'} Error`,
        )
        break
      case ErrorPageType.Unknown:
        this.showModal('/errors/unknown')
        break
    }
  }
}
