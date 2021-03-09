import electronlog from 'electron-log'
import { Logger as eLogger } from 'electron-updater'

export const log: eLogger = electronlog

export const connect = () => {
  console.log = electronlog.log
  console.warn = electronlog.warn
  console.error = electronlog.error
}

export const getLogFolder = (): string => {
  return electronlog.transports.file.getFile().path
}
