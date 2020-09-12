import { SaladBridge } from '../SaladBridge'
import { INotificationService } from './INotificationService'
import { ErrorMessage } from './models/ErrorMessage'
import { PluginStatus } from './models/PluginStatus'
import { StatusMessage } from './models/StatusMessage'

export class SaladBridgeNotificationService implements INotificationService {
  constructor(private readonly bridge: SaladBridge, private readonly onStatusChange?: (status: PluginStatus) => void) {}

  sendStatus = (message: StatusMessage) => {
    this.onStatusChange?.(message.status)
    this.bridge.send('mining-status', message)
  }

  sendError = (message: ErrorMessage) => {
    this.bridge.send('mining-error', message)
  }
}
