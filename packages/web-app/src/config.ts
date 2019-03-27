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

const requiredString = (name: string) => {
  let v = process.env[name]

  if (!v) throw Error(`Unable to find env variable ${name}`)

  return v
}

const optionalString = (name: string): string | undefined => {
  return process.env[name]
}

class Config {
  public readonly dataRefreshRate: number = numberOrDefault('REACT_APP_APP_REFRESH_RATE', convertMinutes(5))

  public readonly rewardsRefreshRate: number = numberOrDefault('REACT_APP_REWARD_REFRESH_RATE', convertMinutes(5))

  public readonly balanceEstimateRate: number = numberOrDefault('REACT_APP_BALANCE_ESTIMATE_RATE', convertSeconds(1))

  public readonly baseAPIUrl: string = requiredString('REACT_APP_API_URL')

  public readonly auth0Domain: string = requiredString('REACT_APP_AUTH0_DOMAIN')
  public readonly auth0ClientId: string = requiredString('REACT_APP_AUTH0_CLIENT_ID')
  public readonly authRefreshRate: number = numberOrDefault('REACT_APP_AUTH_REFRESH_RATE', convertHours(4))

  public readonly mixpanelToken?: string = optionalString('REACT_APP_MIXPANEL_TOKEN')

  /** The current version of the terms of service */
  public readonly termsVersion: string = requiredString('REACT_APP_TERMS_VERSION')

  public readonly devTools: boolean = optionalBool('REACT_APP_DEV_TOOLS')

  public readonly supportUrl: string = requiredString('REACT_APP_SUPPORT_URL')
  public readonly discordUrl: string = requiredString('REACT_APP_DISCORD_URL')
}

const instance = new Config()

export { instance as Config }
