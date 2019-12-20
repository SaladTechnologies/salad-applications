import { ErrorDefinition } from './ErrorDefinition'

export interface PluginDefinition {
  name: string
  downloadUrl: string
  exe: string
  args: string
  runningCheck: string
  initialTimeout: number
  initialRetries: number
  errors?: ErrorDefinition[]
}
