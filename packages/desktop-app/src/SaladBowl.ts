import { spawn, ChildProcess, exec } from 'child_process'

export class SaladBowl {
  private childProcess?: ChildProcess
  private isRunning = false
  private autoRestart = false
  private processName: string = 'SaladBowl.exe'

  start = () => {
    if (this.childProcess || this.isRunning) {
      console.log('Salad bowl is already running and cannot be started again.')
      return
    }
    console.log('Starting SaladBowl')

    this.isRunning = true
    this.autoRestart = true

    let cmd = `cd dist && cd salad-bowl && ${this.processName}`

    let ls = spawn(cmd, {
      shell: true,
      windowsHide: true,
    })

    this.childProcess = ls

    if (ls.stdout) {
      ls.stdout.on('data', data => {
        console.log(data.toString())
      })
    }

    if (ls.stderr) {
      ls.stderr.on('data', data => {
        console.error(data.toString())
      })
    }

    ls.on('exit', msg => {
      console.log('exit: ' + msg)
      this.childProcess = undefined
      this.isRunning = false

      if (this.autoRestart) {
        console.log('SaladBowl exited, Restarting...')
        this.start()
      }
    })
  }

  stop = () => {
    if (this.childProcess && !this.childProcess.killed) {
      this.autoRestart = false
      exec(`taskkill /im ${this.processName} /t /f`, () => {
        console.log('Salad Bowl Stopped')
        this.childProcess = undefined
        this.isRunning = false
      })
    } else {
      console.log('No process to kill.')
    }
  }
}
