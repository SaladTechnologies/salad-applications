// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { action, autorun, observable } from 'mobx'
import { MiningStatus } from './modules/machine/models'
import { NotificationMessageCategory } from './modules/notifications/models'
import { ErrorMessage } from './modules/salad-bowl/models/ErrorMessage'
import { getZendeskAVData } from './modules/zendesk/utils'
import { RootStore } from './Store'

export enum ErrorPageType {
  AntiVirus = 'antivirus',
  Firewall = 'firewall',
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

  @observable
  public hasViewedAVErrorPage: boolean = false

  @observable
  public hasViewedFirewallErrorPage: boolean = false

  @action
  showModal = (url: string) => {
    this.store.routing.push(url)
  }

  @action
  hideModal = (trackModalClosed?: boolean) => {
    if (trackModalClosed) {
      this.store.analytics.trackButtonClicked('modal_close_button', 'Modal Close Button', 'enabled')
    }
    this.store.routing.goBack()
  }

  @action
  showErrorPage = (type: ErrorPageType, errorMessage?: ErrorMessage) => {
    switch (type) {
      case ErrorPageType.AntiVirus:
        const hasViewedAVErrorPage = this.hasViewedAVErrorPage
        if (!hasViewedAVErrorPage && errorMessage) {
          this.store.analytics.trackMiningError(errorMessage.errorCategory, errorMessage.errorCode)

          const antiVirusSoftware = this.store.zendesk.detectedAV
          if (antiVirusSoftware) {
            const articleId = getZendeskAVData(antiVirusSoftware).id
            this.showModal(`/errors/anti-virus/${articleId}`)
            this.updateViewedAVErrorPage(true)
            this.store.analytics.trackErrorPageViewed(`${antiVirusSoftware} Anti-Virus Error`)
          } else {
            this.showModal('/errors/anti-virus')
            this.updateViewedAVErrorPage(true)
            this.store.analytics.trackErrorPageViewed('Generic Anti-Virus Error')
          }
        }
        break
      case ErrorPageType.Firewall:
        const hasViewedFirewallErrorPage = this.hasViewedFirewallErrorPage
        if (!hasViewedFirewallErrorPage && errorMessage) {
          this.store.analytics.trackMiningError(errorMessage.errorCategory, errorMessage.errorCode)
          this.showModal('/errors/firewall')
          this.updateViewedFirewallErrorPage(true)
          this.store.analytics.trackErrorPageViewed('Firewall Error')
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
  updateViewedAVErrorPage = (value: boolean) => {
    this.hasViewedAVErrorPage = value
  }

  @action
  updateViewedFirewallErrorPage = (value: boolean) => {
    this.hasViewedFirewallErrorPage = value
  }

  @action
  navigateToAVPage = () => {
    const antiVirusSoftware = this.store.zendesk.detectedAV
    if (antiVirusSoftware) {
      const articleId = getZendeskAVData(antiVirusSoftware).id
      this.showModal(`/errors/anti-virus/${articleId}`)
      this.store.analytics.trackErrorPageViewed(`${antiVirusSoftware} Anti-Virus Error`)
    } else {
      this.showModal('/errors/anti-virus')
      this.store.analytics.trackErrorPageViewed('Generic Anti-Virus Error')
    }
  }

  @action
  trackAntiVirusGuideLinkClick = (id: number) => {
    const antiVirusSoftware = getZendeskAVData(id).name
    this.store.analytics.trackErrorPageViewed(`${antiVirusSoftware} Anti-Virus Error`)
  }
}
