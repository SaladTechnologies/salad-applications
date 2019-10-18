import { ErrorCategory } from './ErrorCategory'
import { ErrorAction } from './ErrorAction'
export interface ErrorDefinition {
  /** The log message to look for */
  message: string
  /** The error code */
  errorCode: number
  /** The category for the error */
  errorCategory: ErrorCategory
  /** The action SaladBowl should take when encountering this error*/
  errorAction: ErrorAction
}
