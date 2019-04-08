import * as electronlog from 'electron-log'

export module Logger {
  export const connect = () => {
    console.log = electronlog.log
    console.warn = electronlog.warn
    console.error = electronlog.error
    console.exception = electronlog.error
  }
}
