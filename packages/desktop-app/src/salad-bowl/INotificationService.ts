import { StatusMessage } from './models/StatusMessage'
import { ErrorMessage } from './models/ErrorMessage'

export interface INotificationService {
  /** Sends a status message */
  sendStatus(message: StatusMessage): void

  /** Changes the mining plugin */
  sendPluginChange(): void

  /** Sends an error message */
  sendError(message: ErrorMessage): void
}
