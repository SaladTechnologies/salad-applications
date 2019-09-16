import { convertMinutes, convertSeconds, convertHours } from './utils'

declare global {
  interface Window {
    config: ProcessEnv
  }
}

export interface ProcessEnv {
  [key: string]: string | undefined
}

const numberOrDefault = (name: string, defaultValue: number): number => {
  let v = Number(process.env[name])

  if (isNaN(v)) return defaultValue

  return v
}

const optionalBool = (name: string): boolean => {
  let v = process.env[name]

  switch (v) {
    case 'true':
    case '1':
    case 'yes':
      return true
    default:
      return false
  }
}

const requiredString = (name: string, defaultValue?: string): string => {
  let v = process.env[name]

  if (!v) {
    if (defaultValue) return defaultValue
    else throw Error(`Unable to find env variable ${name}`)
  }

  return v
}

const optionalString = (name: string): string | undefined => {
  return process.env[name]
}

class Config {
  public readonly appVersion: string = requiredString('REACT_APP_VERSION')
  public readonly appBuild: string = requiredString('REACT_APP_BUILD')

  public readonly dataRefreshRate: number = numberOrDefault('REACT_APP_APP_REFRESH_RATE', convertMinutes(5))
  public readonly xpRefreshRate: number = numberOrDefault('REACT_APP_APP_XP_REFRESH_RATE', convertMinutes(1))

  public readonly rewardsRefreshRate: number = numberOrDefault('REACT_APP_REWARD_REFRESH_RATE', convertMinutes(5))
  public readonly statusHeartbeatRate: number = numberOrDefault(
    'REACT_APP_STATUS_HEARTBEAT_REFRESH_RATE',
    convertMinutes(1),
  )
  public readonly zeroHashrateNotification: number = numberOrDefault('REACT_APP_ZERO_HASHRATE_NOTIFICATION', 5)

  public readonly balanceEstimateRate: number = numberOrDefault('REACT_APP_BALANCE_ESTIMATE_RATE', convertSeconds(1))

  public readonly baseAPIUrl: string = requiredString('REACT_APP_API_URL')

  public readonly auth0Domain: string = requiredString('REACT_APP_AUTH0_DOMAIN')
  public readonly auth0ClientId: string = requiredString('REACT_APP_AUTH0_CLIENT_ID')
  public readonly authRefreshRate: number = numberOrDefault('REACT_APP_AUTH_REFRESH_RATE', convertHours(4))

  public readonly mixpanelToken?: string = optionalString('REACT_APP_MIXPANEL_TOKEN')

  public readonly sentryDSN?: string = optionalString('REACT_APP_SENTRY_DSN')

  /** The current version of the terms of service */
  public readonly dataTrackingVersion: string = requiredString('REACT_APP_DATA_TRACKING_VERSION')
  public readonly termsVersion: string = requiredString('REACT_APP_TERMS_VERSION')
  public readonly whatsNewVersion: string = requiredString('REACT_APP_WHATS_NEW_VERSION')

  public readonly devTools: boolean = optionalBool('REACT_APP_DEV_TOOLS')

  public readonly supportUrl: string = requiredString('REACT_APP_SUPPORT_URL')
  public readonly discordUrl: string = requiredString('REACT_APP_DISCORD_URL')
  public readonly releaseNotesUrl: string = requiredString('REACT_APP_RELEASES_URL')
  public readonly maxBalanceDelta: number = numberOrDefault('REACT_APP_MAX_BALANCE_DELTA', 0.01)
  public readonly downTime: boolean = optionalBool('REACT_APP_DOWN_TIME')
}

const instance = new Config()

export { instance as Config }
