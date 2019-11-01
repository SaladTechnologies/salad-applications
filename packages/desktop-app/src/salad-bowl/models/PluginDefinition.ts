import { ErrorDefinition } from './ErrorDefinition'
import { FileDefinition } from './FileDefinition'

export interface PluginDefinition {
  name: string
  downloadUrl: string
  exe: string
  args?: string
  runningCheck: string
  fileChecks?: string[]
  errors?: ErrorDefinition[]
  extraFiles?: FileDefinition[]
  autoRestart?: boolean
}
