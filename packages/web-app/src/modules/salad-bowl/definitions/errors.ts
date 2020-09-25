import { ErrorAction } from '../models/ErrorAction'
import { ErrorCategory } from '../models/ErrorCategory'

export const STANDARD_ERRORS = [
  // Anti-Virus
  {
    message: 'not recognized as an internal or external command',
    errorCode: 100000000,
    errorCategory: ErrorCategory.AntiVirus,
    errorAction: ErrorAction.Ignore,
  },
  {
    message: 'cannot find the path specified',
    errorCode: 100000002,
    errorCategory: ErrorCategory.AntiVirus,
    errorAction: ErrorAction.Ignore,
  },
  {
    message: 'cannot access the file because it is being used',
    errorCode: 100000004,
    errorCategory: ErrorCategory.AntiVirus,
    errorAction: ErrorAction.Ignore,
  },
]
