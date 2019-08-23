import { spawn, ChildProcess, exec } from 'child_process'
import { MachineInfo } from './models/MachineInfo'

interface Error {
  error: string
  code: number
}

export class Ethminer {
  private childProcess?: ChildProcess
  private isRunning = false
  private processName: string = ''

  public onError?: (errorCode: number) => void

  private checkForErrors = (message: string) => {
    if (!this.onError) {
      console.warn('No error handler detected. Skipping...')
      return
    }

    const errors: Error[] = [
      // Anti-Virus
      { error: 'is not recognized as an internal or external command', code: 314159265 },
      { error: 'The system cannot find the path specified', code: 314159265 },
      { error: 'No OpenCL platforms found', code: 314159265 },
      { error: 'Socket write failed', code: 314159265 },
      // CUDA
      { error: '3221225595', code: 8675309 },
      { error: '3221225781', code: 8675309 },
      { error: 'CUDA error: Insufficient CUDA driver: 9', code: 8675309 },
      { error: 'CUDA error: Insufficient CUDA driver: 7050', code: 8675309 },
      // Unknown
      { error: 'stratum  Error', code: 9999 },
      { error: 'exit: 0', code: 9999 },
      // Network Errors
      { error: 'Network Error', code: 9999 },
      { error: 'No connection', code: 9999 },
      // No modal errors
      { error: 'exit: 1', code: 8888 },
    ]

    errors.map(item => {
      if (message.includes(item.error)) return this.onError!(item.code)
    })
  }

  start = (machineInfo: MachineInfo, id: string) => {
    if (this.childProcess || this.isRunning) {
      console.log('Ethminer already running and cannot be started again.')
      return
    }

    this.isRunning = true

    let cuda = machineInfo.gpus.some(x => x.vendor.toLocaleLowerCase().includes('nvidia'))

    console.log('cuda: ' + cuda)
    console.log('machineId: ' + id)

    let platform = cuda ? '-U' : '-G'
    this.processName = 'ethminer.exe'

    let cmd = `cd dist && cd ethminer && ${
      this.processName
    } --farm-recheck 1000 ${platform} -P stratum1+tcp://0x6fF85749ffac2d3A36efA2BC916305433fA93731@eth-us-west1.nanopool.org:9999/${id}/notinuse%40salad.io`
    let ls = spawn(cmd, {
      shell: true,
      windowsHide: true,
    })

    this.childProcess = ls

    if (ls.stdout) {
      ls.stdout.on('data', data => {
        console.log('stdout: ' + data)
        this.checkForErrors(data)
      })
    }

    if (ls.stderr) {
      ls.stderr.on('data', data => {
        console.error('stderr: ' + data)
        this.checkForErrors(data)
      })
    }

    ls.on('close', code => {
      console.log('closed with exit code: ' + code)
    })

    ls.on('error', err => {
      console.error('error: ' + err)
    })

    ls.on('exit', msg => {
      const exit = 'exit: ' + msg
      console.log(exit)
      this.checkForErrors(exit)
    })
  }

  stop = () => {
    if (this.childProcess && !this.childProcess.killed) {
      exec(`taskkill /im ${this.processName} /t /f`, () => {
        console.log('miner is stopped')
        this.childProcess = undefined
        this.isRunning = false
      })
    } else {
      console.log('No process to kill.')
    }
  }
}
//     if (isAmdGpu) {
//       ls = spawn(
//         `cd mining && cd ethMiner_v1.17 && setx GPU_FORCE_64BIT_PTR 0 && setx GPU_MAX_HEAP_SIZE 100 && setx GPU_USE_SYNC_OBJECTS 1 && setx GPU_SINGLE_ALLOC_PERCENT 100 && ethminer.exe --farm-recheck 1000 -G -P stratum1+tcp://0x6fF85749ffac2d3A36efA2BC916305433fA93731@eth-us-west1.nanopool.org:9999/${macAddress}/notinuse@salad.io`,
//         {
//           shell: true,
//         },
//       )
//     } else {
//       // for NVIDIA
//       ls = spawn(
//         `cd mining && cd ethMiner_v1.17 && setx GPU_FORCE_64BIT_PTR 0 && setx GPU_MAX_HEAP_SIZE 100 && setx GPU_USE_SYNC_OBJECTS 1 && setx GPU_SINGLE_ALLOC_PERCENT 100 && ethminer_cuda.exe --farm-recheck 1000 -U -P stratum1+tcp://0x6fF85749ffac2d3A36efA2BC916305433fA93731@eth-us-west1.nanopool.org:9999/${macAddress}/notinuse@salad.io`,
//         {
//           shell: true,
//         },
//       )
//     }
