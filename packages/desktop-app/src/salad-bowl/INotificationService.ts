import { ErrorMessage } from './models/ErrorMessage'
import { StatusMessage } from './models/StatusMessage'

export interface INotificationService {
  /** Sends a status message */
  sendStatus(message: StatusMessage): void

  /** Sends an error message */
  sendError(message: ErrorMessage): void
}
