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

// Vite replaces `import.meta.env.X` at build time only when `X` is written out, so every variable is listed here.
const env: ProcessEnv = {
  REACT_APP_API_URL: import.meta.env.REACT_APP_API_URL,
  REACT_APP_BUILD: import.meta.env.REACT_APP_BUILD,
  REACT_APP_DATA_REFRESH_RATE: import.meta.env.REACT_APP_DATA_REFRESH_RATE,
  REACT_APP_LOGIN_URL: import.meta.env.REACT_APP_LOGIN_URL,
  REACT_APP_MIXPANEL_TOKEN: import.meta.env.REACT_APP_MIXPANEL_TOKEN,
  REACT_APP_REWARD_REFRESH_RATE: import.meta.env.REACT_APP_REWARD_REFRESH_RATE,
  REACT_APP_SEARCH_ENGINE: import.meta.env.REACT_APP_SEARCH_ENGINE,
  REACT_APP_SEARCH_KEY: import.meta.env.REACT_APP_SEARCH_KEY,
  REACT_APP_SEARCH_URL: import.meta.env.REACT_APP_SEARCH_URL,
  REACT_APP_STRAPI_UPLOAD_URL: import.meta.env.REACT_APP_STRAPI_UPLOAD_URL,
}

const numberOrDefault = (name: string, defaultValue: number): number => {
  let v = Number(env[name])

  if (isNaN(v)) return defaultValue

  return v
}

const optionalString = (name: string): string | undefined => {
  return env[name]
}

const requiredString = (name: string, defaultValue?: string): string => {
  let v = env[name]

  if (!v) {
    if (defaultValue) return defaultValue
    else throw Error(`Unable to find env variable ${name}`)
  }

  return v
}

class Config {
  public readonly appBuild: string = requiredString('REACT_APP_BUILD')
  public readonly dataRefreshRate: number = numberOrDefault('REACT_APP_DATA_REFRESH_RATE', convertMinToMilli(5))
  public readonly mixpanelToken?: string = optionalString('REACT_APP_MIXPANEL_TOKEN')
  public readonly rewardRefreshRate: number = numberOrDefault('REACT_APP_REWARD_REFRESH_RATE', convertMinToMilli(5))
  public readonly searchUrl: string = requiredString('REACT_APP_SEARCH_URL')
  public readonly strapiUploadUrl: string = requiredString('REACT_APP_STRAPI_UPLOAD_URL')
  public readonly loginUrl: string = requiredString('REACT_APP_LOGIN_URL')
  public readonly isTestEnvironment: boolean = requiredString('REACT_APP_API_URL').includes('testing')

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
}

export const config = new Config()
