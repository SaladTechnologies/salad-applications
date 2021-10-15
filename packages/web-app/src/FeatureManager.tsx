import { createContext, useContext } from 'react'
import { UnleashClient } from 'unleash-proxy-client'

export interface FeatureManager {
  getVariant: (feature: string) => string
  handleLogin: (userId: string) => void
  handleLogout: () => void
  isEnabled: (feature: string) => boolean
  isEnabledCached: (feature: string) => boolean
  start: () => Promise<void>
}

export class UnleashFeatureManager implements FeatureManager {
  private readonly client: UnleashClient | undefined
  private readonly cache: Record<string, boolean>

  public constructor() {
    this.cache = {}
    if (process.env.REACT_APP_UNLEASH_URL && process.env.REACT_APP_UNLEASH_API_KEY) {
      this.client = new UnleashClient({
        url: process.env.REACT_APP_UNLEASH_URL,
        clientKey: process.env.REACT_APP_UNLEASH_API_KEY,
        appName: 'web-app',
      })

      // TODO: refactor to add this at top app-level initialization
      this.start()
    }
  }

  public start = (): Promise<void> => {
    if (this.client) {
      return this.client.start()
    } else {
      return Promise.resolve()
    }
  }

  public getVariant = (feature: string): string => {
    if (this.client) {
      const variant = this.client.getVariant(feature)
      return variant.name
    } else {
      return 'disabled'
    }
  }

  public handleLogin = (userId: string): void => {
    if (this.client) {
      const { appName, environment, ...context } = this.client.getContext()
      this.client.updateContext({
        ...context,
        userId,
      })
    }
  }

  public handleLogout = (): void => {
    if (this.client) {
      const { appName, environment, userId, ...context } = this.client.getContext()
      this.client.updateContext(context)
    }
  }

  public isEnabled = (feature: string): boolean => {
    if (this.client) {
      const value = this.client.isEnabled(feature)
      if (this.cache[feature] === undefined) {
        this.cache[feature] = value
      }
      return value
    } else {
      return false
    }
  }

  public isEnabledCached = (feature: string): boolean => {
    const value = this.cache[feature]
    if (value === undefined) {
      return this.isEnabled(feature)
    } else {
      return value
    }
  }
}

class DefaultFeatureManager implements FeatureManager {
  public getVariant = (): string => 'disabled'

  public handleLogin = (): void => {}

  public handleLogout = (): void => {}

  public isEnabled = (): boolean => false

  public isEnabledCached = (): boolean => false

  public start = (): Promise<void> => Promise.resolve()
}

const FeatureManagerContext = createContext<FeatureManager>(new DefaultFeatureManager())
FeatureManagerContext.displayName = 'FeatureManager'

export const FeatureManagerConsumer = FeatureManagerContext.Consumer

export const FeatureManagerProvider = FeatureManagerContext.Provider

export const useFeatureManager = () => useContext(FeatureManagerContext)
