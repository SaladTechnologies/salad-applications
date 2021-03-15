import { ErrorAction } from '../models/ErrorAction'
import { ErrorCategory } from '../models/ErrorCategory'

let ErrorCode = 100000000
const antiVirusErrorMessages: string[] = [
  'not recognized as an internal or external command',
  'cannot find the path specified',
  'cannot access the file because it is being used',
  'Access is denied',
  'Acesso negado',
  'Accesso negato',
  'Toegang geweigerd',
  'Zugriff verweigert',
  'The system cannot execute the specified program',
  'The system cannot find the file',
  'Command is either misspelt or could not be found',
  'Der Prozess kann nicht auf die Datei zugreifen, da sie von einem anderen Prozess verwendet wird',
  'The process cannot access the file because it is being used by another process',
  'Anti-hacking system detected modification of the miner memory',
  'riconosciuto come comando interno o esterno',
  'Das angegebene Programm kann nicht ausgef',
  'nds av en annan process',
  'reconhecido como um comando interno ou externo, um programa oper',
]

export const STANDARD_ERRORS = antiVirusErrorMessages.map((message, index) => {
  if (index !== 0) {
    ErrorCode += 2
  }
  return {
    message: message,
    errorCode: ErrorCode,
    errorCategory: ErrorCategory.AntiVirus,
    errorAction: ErrorAction.Ignore,
  }
})
