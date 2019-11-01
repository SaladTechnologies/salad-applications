import { PluginStatus } from './PluginStatus'

export interface StatusMessage {
  /** The name of the plugin */
  name: string
  /** The new status of the plugin */
  status: PluginStatus
}
