import * as LDSdk from 'launchdarkly-js-client-sdk'
import { Config } from './config'

export class FeatureFlags {
  private ldClient: LDSdk.LDClient | undefined

  loadFeatureFlags = async (userId: string): Promise<void> => {
    this.ldClient = LDSdk.initialize(Config.launchDarklyId, { key: userId })

    await this.ldClient.waitUntilReady()
  }

  getBool = (key: string, defaultValue: boolean = false): boolean => {
    if (this.ldClient) return this.ldClient.variation(key, defaultValue)
    return defaultValue
  }
}

const instance = new FeatureFlags()

export { instance as featureFlags }
