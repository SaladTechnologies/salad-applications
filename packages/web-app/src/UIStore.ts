import { action, autorun } from 'mobx'
import { MiningStatus } from './modules/machine/models'
import { NotificationMessageCategory } from './modules/notifications/models'
import { ErrorMessage } from './modules/salad-bowl/models/ErrorMessage'
import { getZendeskAVData } from './modules/zendesk/utils'
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
  constructor(private readonly store: RootStore) {
    autorun(() => {
      const status = this.store.saladBowl.status
      if (status) {
        if (
          status === MiningStatus.Running &&
          this.store.routing.location.pathname === '/warnings/dont-lose-progress'
        ) {
          this.hideModal()
          this.store.notifications.sendNotification({
            category: NotificationMessageCategory.Success,
            title: 'Chopping Started Successfully',
            message:
              'Congratulations! Your machine is successfully chopping. You should see your first balance within 1-30 minutes.',
            id: 123456789,
          })
        }
      }
    })
  }

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
  showErrorPage = (type: ErrorPageType, errorMessage?: ErrorMessage) => {
    switch (type) {
      case ErrorPageType.AntiVirus:
        const hasViewedAVErrorPage = this.store.saladBowl.hasViewedAVErrorPage
        if (!hasViewedAVErrorPage && errorMessage) {
          this.store.analytics.trackMiningError(errorMessage.errorCategory, errorMessage.errorCode)
        }

        const antiVirusSoftware = this.store.zendesk.detectedAV
        if (antiVirusSoftware) {
          this.store.analytics.trackErrorPageViewed(`${antiVirusSoftware} Anti-Virus Error`)
          const articleId = getZendeskAVData(antiVirusSoftware).id
          if (!hasViewedAVErrorPage) {
            this.showModal(`/errors/anti-virus/${articleId}`)
            this.store.saladBowl.updateViewedAVErrorPage(true)
          }
        } else {
          this.store.analytics.trackErrorPageViewed('Generic Anti-Virus Error')
          if (!hasViewedAVErrorPage) {
            this.showModal('/errors/anti-virus')
            this.store.saladBowl.updateViewedAVErrorPage(true)
          }
        }
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

  @action
  navigateToAVPage = () => {
    const antiVirusSoftware = this.store.zendesk.detectedAV
    if (antiVirusSoftware) {
      this.store.analytics.trackErrorPageViewed(`${antiVirusSoftware} Anti-Virus Error`)
      const articleId = getZendeskAVData(antiVirusSoftware).id
      this.showModal(`/errors/anti-virus/${articleId}`)
    } else {
      this.store.analytics.trackErrorPageViewed('Generic Anti-Virus Error')
      this.showModal('/errors/anti-virus')
    }
  }

  @action
  trackAntiVirusGuideLinkClick = (id: number) => {
    const antiVirusSoftware = getZendeskAVData(id).name
    this.store.analytics.trackErrorPageViewed(`${antiVirusSoftware} Anti-Virus Error`)
  }
}
