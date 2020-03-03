import * as electronlog from 'electron-log'
import { Logger as eLogger } from 'electron-updater'
import { net } from 'electron'
import * as fs from 'fs'

export module Logger {
  export const log: eLogger = electronlog
  export const connect = () => {
    console.log = electronlog.log
    console.warn = electronlog.warn
    console.error = electronlog.error
  }
  export const sendLog = (id: string) => {
    try {
      //Ensures that the id is always a value
      if (id === null || id.match(/^ *$/) !== null) id = 'unknown'

      let logPath = electronlog.transports.file.findLogPath()
      let logStream = fs.createReadStream(logPath)
      console.log(`Sending logs for ${id}`)

      const request = net.request({
        method: 'POST',
        url: `https://app.salad.io/api/v1/logs/${id}`,
      })

      logStream.on('data', chunk => {
        // console.log('Log file data')
        request.write(chunk)
      })

      logStream.on('close', () => {
        request.end()
      })

      request.on('response', response => {
        // check response.statusCode to determine if the request succeeded
        console.log(`Log sent status: ${response.statusCode}`)
      })
    } catch {}
  }
}
