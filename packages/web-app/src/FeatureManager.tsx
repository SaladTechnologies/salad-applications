import { createContext, useContext } from 'react'
import { UnleashClient } from 'unleash-proxy-client'
import type { Config } from './config'
import type { AnalyticsStore } from './modules/analytics'

export enum FeatureFlags {
  Achievements = 'app_saladachievements',
}

export interface FeatureManager {
  getVariant: (feature: string) => string
  handleLogin: (userId: string) => void
  handleLogout: () => void
  isEnabled: (feature: string) => boolean
  isEnabledCached: (feature: string) => boolean
  start: () => Promise<void>
  setAnalyticsStore: (analyticsStore: AnalyticsStore) => void
}

export class UnleashFeatureManager implements FeatureManager {
  private readonly client: UnleashClient | undefined
  private readonly cache: Record<string, boolean>
  private analyticsStore: AnalyticsStore | undefined

  public constructor(config: Config, analyticsStore: AnalyticsStore | undefined) {
    this.cache = {}
    this.client = new UnleashClient({
      url: config.unleashUrl,
      clientKey: config.unleashApiKey,
      appName: 'web-app',
      refreshInterval: 60,
      metricsInterval: 60,
    })
    this.analyticsStore = analyticsStore

    // TODO: refactor to add this at top app-level initialization
    this.start()

    let events: any[] = []
    this.client.on('impression', (event: any) => {
      if (event.enabled) {
        if (this.analyticsStore !== undefined) {
          this.analyticsStore.trackUnleashEvent('$experiment_started', {
            'Experiment name': event.featureName,
            'Variant name': event.variant,
          })
          if (events.length > 0) {
            events.forEach((event) => {
              // This second conditional is necessary, implying asynchronous execution.
              // There is probably a race condition which may cause impression events to be lost, but I don't know where.
              // I don't know this code or this language well enough to propose a fix.
              if (this.analyticsStore !== undefined) {
                this.analyticsStore.trackUnleashEvent('$experiment_started', {
                  'Experiment name': event.featureName,
                  'Variant name': event.variant,
                })
              }
            })
            events = []
          }
        } else {
          events.push(event)
        }
      }
    })
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

  public setAnalyticsStore = (analyticsStore: AnalyticsStore) => {
    this.analyticsStore = analyticsStore
  }
}

class DefaultFeatureManager implements FeatureManager {
  public getVariant = (): string => 'disabled'

  public handleLogin = (): void => {}

  public handleLogout = (): void => {}

  public isEnabled = (): boolean => false

  public isEnabledCached = (): boolean => false

  public start = (): Promise<void> => Promise.resolve()

  public setAnalyticsStore = (_analyticsStore: AnalyticsStore): void => {}
}

const FeatureManagerContext = createContext<FeatureManager>(new DefaultFeatureManager())
FeatureManagerContext.displayName = 'FeatureManager'

export const FeatureManagerProvider = FeatureManagerContext.Provider

export const FeatureManagerConsumer = FeatureManagerContext.Consumer
export const useFeatureManager = () => useContext(FeatureManagerContext)
