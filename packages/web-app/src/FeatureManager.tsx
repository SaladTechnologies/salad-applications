import { createContext, useContext } from 'react'
import { UnleashClient } from 'unleash-proxy-client'

export interface FeatureManager {
  getVariant: (feature: string) => string
  handleLogin: (userId: string) => void
  handleLogout: () => void
  isEnabled: (feature: string) => boolean
}

export class UnleashFeatureManager implements FeatureManager {
  private readonly client: UnleashClient | undefined

  public constructor() {
    if (process.env.REACT_APP_UNLEASH_URL) {
      this.client = new UnleashClient({
        url: process.env.REACT_APP_UNLEASH_URL,
        clientKey: 'zrujLzhnwVZkIOlS74oZZ0DK7ZXs3Ifo',
        appName: 'web-app',
      })
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
    this.client?.updateContext({
      userId,
    })
  }

  public handleLogout = (): void => {
    this.client?.updateContext({
      userId: undefined,
    })
  }

  public isEnabled = (feature: string): boolean => {
    if (this.client) {
      return this.client.isEnabled(feature)
    } else {
      return false
    }
  }
}

class DefaultFeatureManager implements FeatureManager {
  public getVariant = (): string => 'disabled'

  public handleLogin = (): void => {}

  public handleLogout = (): void => {}

  public isEnabled = (): boolean => false
}

const FeatureManagerContext = createContext<FeatureManager>(new DefaultFeatureManager())
FeatureManagerContext.displayName = 'FeatureManager'

export const FeatureManagerConsumer = FeatureManagerContext.Consumer

export const FeatureManagerProvider = FeatureManagerContext.Provider

export const useFeatureManager = () => useContext(FeatureManagerContext)
