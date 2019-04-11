import mixpanel from 'mixpanel-browser'
import { Config } from '../../config'
import { Profile } from '../profile/models'
import * as Sentry from '@sentry/browser'

export class AnalyticsStore {
  private started = false

  public start = (profile: Profile) => {
    if (this.started) {
      console.warn('Analytics already started. Skipping...')
      return
    }

    const token = Config.mixpanelToken
    if (token) {
      mixpanel.init(token)

      mixpanel.people.set({
        $email: profile.email,
        $last_name: profile.username,
        $last_login: new Date(),
      })

      mixpanel.identify(profile.id)

      Sentry.configureScope(scope => {
        scope.setUser({
          id: profile.id,
          email: profile.email,
          username: profile.username,
        })
      })

      this.started = true

      this.track('LOGIN')
      console.log('Started mixpanel.')
    } else {
      console.log('No mixpanel token found. Skipping...')
    }
  }

  public disable = () => {
    //TODO: disable any analytics
    mixpanel.opt_out_tracking()
    this.started = false
  }

  public track = (event: string, properties?: { [key: string]: any }) => {
    if (!this.started) return
    mixpanel.track(event, properties)
  }

  public captureException = (err: Error) => {
    console.error(err)
    Sentry.captureException(err)
  }
}
