import { exec } from 'child_process'

//Get the mac address the same way getmac does. https://github.com/bevry/getmac/blob/master/source/index.coffee
let mac: string | undefined = undefined

const macRegex: RegExp = /(?:[a-z0-9]{2}[:-]){5}[a-z0-9]{2}/gi

export const getMac = (): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    //If we already have a mac address, return it now
    if (mac) {
      return resolve(mac)
    }

    const cmd = '%SystemRoot%/System32/getmac.exe'
    exec(cmd, (err, stdout, _) => {
      if (err) return reject(err)

      if (!stdout) {
        return reject('Output not found')
      }

      if (mac) {
        return resolve(mac)
      }

      let res = macRegex.exec(stdout)

      if (res !== null && mac === undefined) {
        mac = res[0]
        resolve(mac)
      }
    })
  })
