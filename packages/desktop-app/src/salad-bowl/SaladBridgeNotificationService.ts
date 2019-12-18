import { SaladBridge } from '../SaladBridge'
import { StatusMessage } from './models/StatusMessage'
import { ErrorMessage } from './models/ErrorMessage'
import { INotificationService } from './INotificationService'

export class SaladBridgeNotificationService implements INotificationService {
  constructor(private readonly bridge: SaladBridge) {}

  sendStatus = (message: StatusMessage) => {
    this.bridge.send('mining-status', message)
  }

  sendPluginChange = () => {
    this.bridge.send('plugin-change')
  }

  sendError = (message: ErrorMessage) => {
    this.bridge.send('mining-error', message)
  }
}
