import mixpanel from 'mixpanel-browser'
import { Config } from '../../config'

export class AnalyticsStore {
  private started = false

  public start = () => {
    if (this.started) {
      console.warn('Analytics already started. Skipping...')
      return
    }

    const token = Config.mixpanelToken
    if (token) {
      mixpanel.init(token)
      this.started = true
    } else {
      console.log('No mixpanel token found. Skipping...')
    }
  }

  public disable = () => {
    //TODO: disable any analytics
    this.started = false
  }

  public track = (event: string, properties?: { [key: string]: any }) => {
    if (!this.started) return
    mixpanel.track(event, properties)
  }
}
