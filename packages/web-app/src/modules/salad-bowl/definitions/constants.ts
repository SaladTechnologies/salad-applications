import { ErrorAction } from '../models/ErrorAction'
import { ErrorCategory } from '../models/ErrorCategory'

export const BEAM_WALLET_ADDRESS = '36e4970859cdebbd36e0419ad35b49954e4b6eeac2f990ca1860a9c03a342350363'
export const ETH_WALLET_ADDRESS = '0x6ff85749ffac2d3a36efa2bc916305433fa93731'
export const NICEHASH_MINING_ADDRESS = '368dnSPEiXj1Ssy35BBWMwKcmFnGLuqa1J'

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
