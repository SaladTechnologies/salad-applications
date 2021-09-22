import type { PluginDefinition as PluginDefinitionBase } from '../models/PluginDefinition'
import type { RequirementFn } from './requirements'

export interface PluginDefinition extends PluginDefinitionBase {
  requirements: RequirementFn[]
}
