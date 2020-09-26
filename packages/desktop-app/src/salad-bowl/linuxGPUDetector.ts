import { exec } from 'child_process'
import * as si from 'systeminformation'
import { LinuxGraphicsController, LinuxGraphicsData } from './models/LinuxGraphics'

function getVramFromClinfo() {
  return new Promise<LinuxGraphicsController[]>(function (resolve, reject) {
    exec('clinfo --raw', function (err, stdout: string, stderr: string) {
      if (err) {
        reject(err)
      }
      if (stderr) {
        reject(stderr)
      }
      var regex = /\[(\w+\/\d+)\]\s*(\w+)\s*(.+)/gm
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
            controllers[m[1]]['model'] = m[3]
            break
          case 'CL_DEVICE_BOARD_NAME_AMD':
            controllers[m[1]]['model'] = m[3]
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

function getVramFromGlxinfo() {
  return new Promise<LinuxGraphicsController[]>((resolve, reject) => {
    exec(
      "glxinfo -B | egrep 'vendor|renderer|VBO free memory|Dedicated video memory:'",
      (err, stdout: string, stderr: string) => {
        if (err) {
          reject(err)
        }
        if (stderr) {
          reject(err)
        }
        var device: LinuxGraphicsController = {}
        stdout.split('\n').forEach((line) => {
          try {
            if (line.includes('renderer')) {
              device['model'] = line.match('OpenGL renderer string: (.+)')![1]
            }
            if (line.includes('vendor')) {
              device['vendor'] = line.match('OpenGL vendor string: (.+)')![1]
            }
            // VBO for AMD, Dedicated video memory for Nvidia
            if (line.includes('VBO free memory') || line.includes('Dedicated video memory')) {
              device['vram'] = parseInt(line.match(/\d+/)![0])
            }
          } catch (err) {}
        })
        resolve([device])
      },
    )
  })
}

export function getLinuxGraphics() {
  return new Promise<LinuxGraphicsData>(function (resolve) {
    Promise.allSettled([si.graphics(), getVramFromClinfo(), getVramFromGlxinfo()]).then(
      ([graphics, clinfoOutput, glxinfoOutput]) => {
        var controllerInfo = undefined

        if (clinfoOutput.status === 'fulfilled' && controllerInfo === undefined) {
          controllerInfo = clinfoOutput.value
        }
        if (glxinfoOutput.status === 'fulfilled' && controllerInfo === undefined) {
          controllerInfo = glxinfoOutput.value
        }
        if (graphics.status === 'fulfilled' && controllerInfo === undefined) {
          controllerInfo = graphics.value.controllers
        }

        resolve({
          controllers: controllerInfo,
          displays: graphics.status === 'fulfilled' ? graphics.value.displays : undefined,
        })
      },
    )
  })
}
