import { PluginDefinition as PluginDefinitionBase } from '../models/PluginDefinition'
import { RequirementFn } from './requirements'

export interface PluginDefinition extends PluginDefinitionBase {
  requirements: RequirementFn[]
}
