import { ErrorAction } from '../models/ErrorAction'
import { ErrorCategory } from '../models/ErrorCategory'

export const MINING_ADDRESS = '368dnSPEiXj1Ssy35BBWMwKcmFnGLuqa1J'

export const STANDARD_ERRORS = [
  // Anti-Virus
  {
    message: 'is not recognized as an internal or external command',
    errorCode: 100000000,
    errorCategory: ErrorCategory.AntiVirus,
    errorAction: ErrorAction.Stop,
  },
  {
    message: 'The system cannot find the path specified',
    errorCode: 100000002,
    errorCategory: ErrorCategory.AntiVirus,
    errorAction: ErrorAction.Stop,
  },
]
