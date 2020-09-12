import { observable } from 'mobx'
import { PluginStatus } from './PluginStatus'

export class PluginInfo {
  @observable
  public name?: string

  @observable
  public version?: string

  @observable
  public algorithm?: string

  @observable
  public status: PluginStatus = PluginStatus.Unknown
}
