import * as Storage from './Storage'
import { convertMinToMilli } from './utils'

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
  public readonly dataRefreshRate: number = numberOrDefault('REACT_APP_DATA_REFRESH_RATE', convertMinToMilli(5))
  public readonly mixpanelToken?: string = optionalString('REACT_APP_MIXPANEL_TOKEN')
  public readonly paypalUrl: string = requiredString('REACT_APP_PAYPAL_URL')
  public readonly rewardRefreshRate: number = numberOrDefault('REACT_APP_REWARD_REFRESH_RATE', convertMinToMilli(5))
  public readonly searchUrl: string = requiredString('REACT_APP_SEARCH_URL')
  public readonly strapiUploadUrl: string = requiredString('REACT_APP_STRAPI_UPLOAD_URL')
  public readonly novuAppId: string = requiredString('REACT_APP_NOVU_APP_ID')

  public get apiBaseUrl(): string {
    const override = Storage.getItem('OVERRIDE_APP_API_URL')
    if (override != null) {
      return override
    } else {
      return requiredString('REACT_APP_API_URL')
    }
  }

  public get searchKey(): string {
    const override = Storage.getItem('OVERRIDE_SEARCH_KEY')
    if (override != null) {
      return override
    } else {
      return requiredString('REACT_APP_SEARCH_KEY')
    }
  }

  public get searchEngine(): string {
    const override = Storage.getItem('OVERRIDE_SEARCH_ENGINE')
    if (override != null) {
      return override
    } else {
      return requiredString('REACT_APP_SEARCH_ENGINE')
    }
  }

  public get unleashApiKey(): string {
    const override = Storage.getItem('OVERRIDE_UNLEASH_API_KEY')
    if (override != null) {
      return override
    } else {
      return requiredString('REACT_APP_UNLEASH_API_KEY')
    }
  }

  public get unleashUrl(): string {
    const override = Storage.getItem('OVERRIDE_UNLEASH_URL')
    if (override != null) {
      return override
    } else {
      return requiredString('REACT_APP_UNLEASH_URL')
    }
  }
}

export const config = new Config()
