import { exec } from 'child_process'
import * as si from 'systeminformation'
import { LinuxGraphicsController, LinuxGraphicsData } from './models/LinuxGraphics'

function getVramFromClinfo() {
  return new Promise<LinuxGraphicsController[]>(function (resolve, reject) {
    exec('clinfo --raw', function (err: Error, stdout: string, stderr: string) {
      if (err) {
        reject(err)
      }
      if (stderr) {
        reject(stderr)
      }
      var regex = /\[\w+\/(\d+)\]\s*(\w+)\s*(.+)/gm
      var controllers: { [key: string]: LinuxGraphicsController } = {}
      var m
      while ((m = regex.exec(stdout))) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++
        }
        // Create a key - object pair for each unique GPU. Useful to differentiate between different GPUs.
        if (!Object.keys(controllers).includes(m[1])) {
          controllers[m[1]] = {}
        }
        // Switch and store useful device information for each line in output
        switch (m[2]) {
          case 'CL_DEVICE_NAME':
            controllers[m[1]]['name'] = m[3]
            break
          case 'CL_DEVICE_BOARD_NAME_AMD':
            controllers[m[1]]['name'] = m[3]
            break
          case 'CL_DEVICE_VENDOR':
            controllers[m[1]]['vendor'] = m[3]
            break
          case 'CL_DRIVER_VERSION':
            controllers[m[1]]['driverVersion'] = m[3]
            break
          case 'CL_DEVICE_GLOBAL_MEM_SIZE':
            controllers[m[1]]['vram'] = Math.round(parseInt(m[3]) / 1024 / 1024)
            break
        }
      }
      // Output in a format similar to systeminformation for consistency
      resolve(Object.values(controllers))
    })
  })
}

export function getLinuxGraphics() {
  return new Promise<LinuxGraphicsData>(function (resolve, reject) {
    Promise.allSettled([si.graphics(), getVramFromClinfo()]).then(([graphics, clinfoOutput]) => {
      resolve({
        controllers: clinfoOutput.status === 'fulfilled' ? clinfoOutput.value : undefined,
        displays: graphics.status === 'fulfilled' ? graphics.value.displays : undefined,
      })
    })
  })
}
