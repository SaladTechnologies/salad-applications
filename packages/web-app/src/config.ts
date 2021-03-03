import * as Storage from './Storage'
import { convertMinutes } from './utils'

interface ProcessEnv {
  [key: string]: string | undefined
}

declare global {
  interface Window {
    config: ProcessEnv
  }
}

const numberOrDefault = (name: string, defaultValue: number): number => {
  let v = Number(process.env[name])

  if (isNaN(v)) return defaultValue

  return v
}

const optionalString = (name: string): string | undefined => {
  return process.env[name]
}

const requiredString = (name: string, defaultValue?: string): string => {
  let v = process.env[name]

  if (!v) {
    if (defaultValue) return defaultValue
    else throw Error(`Unable to find env variable ${name}`)
  }

  return v
}

export class Config {
  public readonly appBuild: string = requiredString('REACT_APP_BUILD')
  public readonly appVersion: string = requiredString('REACT_APP_VERSION')
  public readonly auth0Audience: string = requiredString('REACT_APP_AUTH0_AUDIENCE')
  public readonly auth0ClientId: string = requiredString('REACT_APP_AUTH0_CLIENT_ID')
  public readonly auth0Domain: string = requiredString('REACT_APP_AUTH0_DOMAIN')
  public readonly dataRefreshRate: number = numberOrDefault('REACT_APP_DATA_REFRESH_RATE', convertMinutes(5))
  public readonly mixpanelToken?: string = optionalString('REACT_APP_MIXPANEL_TOKEN')
  public readonly rewardRefreshRate: number = numberOrDefault('REACT_APP_REWARD_REFRESH_RATE', convertMinutes(5))
  public readonly sentryDSN?: string = optionalString('REACT_APP_SENTRY_DSN')
  public readonly searchUrl: string = requiredString('REACT_APP_SEARCH_URL')
  public readonly searchKey: string = requiredString('REACT_APP_SEARCH_KEY')
  public readonly searchEngine: string = requiredString('REACT_APP_SEARCH_ENGINE')
  public readonly strapiUploadUrl?: string = optionalString('STRAPI_UPLOAD_API_URL')

  public get apiBaseUrl(): string {
    const override = Storage.getItem('OVERRIDE_APP_API_URL')
    if (override != null) {
      return override
    } else {
      return requiredString('REACT_APP_API_URL')
    }
  }
}

export const config = new Config()
