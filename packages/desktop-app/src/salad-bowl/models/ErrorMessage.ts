import { ErrorCategory } from './ErrorCategory'

export interface ErrorMessage {
  /** The line that caused the error */
  message: string
  /** The error code */
  errorCode: number
  /**The category for the error */
  errorCategory: ErrorCategory
}
