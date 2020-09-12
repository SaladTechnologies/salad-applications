import { ErrorDefinition } from './ErrorDefinition'

export interface PluginDefinition {
  name: string
  version: string
  algorithm: string
  downloadUrl: string
  exe: string
  args: string
  runningCheck: string
  initialTimeout: number
  initialRetries: number
  watchdogTimeout: number
  errors?: ErrorDefinition[]
}
