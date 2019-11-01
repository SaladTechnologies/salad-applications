import { ErrorCategory } from './ErrorCategory'
export interface ErrorMessage {
  message: string
  errorCode: number
  errorCategory: ErrorCategory
}
