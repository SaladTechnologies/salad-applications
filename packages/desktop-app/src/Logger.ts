import * as electronlog from 'electron-log'
import { Logger as eLogger } from 'electron-updater'

export module Logger {
  export const log: eLogger = electronlog
  export const connect = () => {
    console.log = electronlog.log
    console.warn = electronlog.warn
    console.error = electronlog.error
    console.exception = electronlog.error
  }
}
