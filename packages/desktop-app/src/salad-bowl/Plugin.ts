import axios from 'axios'
//@ts-ignore
import DecompressZip from 'decompress-zip'
import { spawn, ChildProcess, execSync } from 'child_process'
import { PluginDefinition } from './models/PluginDefinition'
import { FileDefinition } from './models/FileDefinition'
import { PluginStatus } from './models/PluginStatus'
import { ErrorAction } from './models/ErrorAction'
import * as path from 'path'
import * as fs from 'fs'
import { INotificationService } from './INotificationService'

export class Plugin {
  private _status: PluginStatus = PluginStatus.Unknown

  private process?: ChildProcess

  private stopCalled: boolean = false

  /** The path to the location of the installed plugin */
  public readonly pluginDirectory: string

  get name(): string {
    return this.pluginDefinition.name
  }

  get status(): PluginStatus {
    return this._status
  }

  set status(status: PluginStatus) {
    this._status = status

    this.notificationService.sendStatus({
      name: this.name,
      status: this._status,
    })
  }

  constructor(
    private readonly baseDirectory: string,
    private readonly pluginDefinition: PluginDefinition,
    private readonly notificationService: INotificationService,
  ) {
    this.pluginDirectory = path.join(baseDirectory, this.name)
  }

  /** Starts the plugin */
  public start = async () => {
    let installed = this.checkInstall()
    if (!installed) {
      try {
        //Install
        await this.install()
      } catch (err) {
        console.error(`Unable to install ${this.name}`)
        console.error(JSON.stringify(err))
      }
    }
    this.status = PluginStatus.Initializing

    //Adds any extra files
    if (this.pluginDefinition.extraFiles) {
      await this.addExtraFiles(this.pluginDefinition.extraFiles)
    }
    let exePath = path.join(this.pluginDirectory, this.pluginDefinition.exe)

    console.log(`Starting ${exePath}`)

    //Spawns the plugin's process
    let ls = spawn(`"${exePath}"`, [this.pluginDefinition.args || ''], {
      shell: true,
      windowsHide: true,
    })

    this.process = ls

    if (ls.stdout) {
      ls.stdout.on('data', data => {
        this.onOutput(data.toString())
      })
    }

    if (ls.stderr) {
      ls.stderr.on('data', data => {
        this.onOutput(data.toString())
      })
    }

    ls.on('exit', this.onExit)
  }

  /** Stops the plugin */
  public stop = async () => {
    this.status = PluginStatus.Stopped
    this.stopCalled = true

    if (this.process && !this.process.killed) {
      let processName = path.basename(this.pluginDefinition.exe)
      try {
        execSync(`taskkill /im ${processName} /t /f`)
      } catch {}
      // this.process.kill()
    } else {
      console.log('No process to kill.')
    }
    this.process = undefined
  }

  /** Restarts the plugin */
  restart = async () => {
    await this.stop()
    await this.start()
  }

  /** Checks to see if a plugin has been installed correctly */
  private checkInstall = (): boolean => {
    console.log(`Checking ${this.name} installation at ${this.pluginDirectory}`)

    let installCorrect = this.fileExists(this.pluginDefinition.exe)

    if (installCorrect && this.pluginDefinition.fileChecks)
      installCorrect = this.pluginDefinition.fileChecks.every(this.fileExists)

    console.log(`Plugin installed ${installCorrect ? 'correctly' : 'incorrectly'}`)

    return installCorrect
  }

  /** Check to see if the given file exists*/
  private fileExists = (file: string): boolean => {
    let fullPath = path.join(this.pluginDirectory, file)

    let exists = fs.existsSync(fullPath)

    console.log(`Checked exists:${exists}) - ${fullPath}`)

    return exists
  }

  /** Installs the plugin */
  private install = async () => {
    console.log(`Install started for ${this.name}`)

    this.status = PluginStatus.Installing

    let filename = path.basename(this.pluginDefinition.downloadUrl)
    let downloadFolder = path.join(this.baseDirectory, '_downloads')
    let downloadFilename = path.join(downloadFolder, filename)
    console.log('Installation details', filename, downloadFolder, downloadFilename)

    //Ensure that the download directory exists
    if (!fs.existsSync(downloadFolder)) {
      try {
        console.log(`Download directory started for ${this.name}`)
        await fs.promises.mkdir(downloadFolder, { recursive: true })
        console.log(`Download directory finished for ${this.name}`)
      } catch (err) {
        console.log('Download directory creation error', err)
        return
      }
    }

    //Removes any previous downloads
    if (fs.existsSync(downloadFilename)) {
      console.log(`Previous download removal started for ${this.name}`)
      await fs.promises.unlink(downloadFilename)
      console.log(`Previous download removal completed for ${this.name}`)
    }

    console.log(`Starting download for ${this.name}`)
    let res = await axios.get(this.pluginDefinition.downloadUrl, { responseType: 'stream' })

    await new Promise(fulfill => {
      let stream = res.data.pipe(fs.createWriteStream(downloadFilename))
      stream.on('finish', fulfill)
    })

    console.log(`Download complete ${this.name}`)
    console.log(`Extracting ${this.name}`)

    await new Promise((fulfill, reject) => {
      let unzipper = new DecompressZip(downloadFilename)

      unzipper.on('error', (err: any) => {
        console.log(`Unzipping failed for ${this.name}`, err)
        reject(err)
      })

      unzipper.on('extract', () => {
        console.log('Finished extracting')
        fulfill()
      })

      unzipper.extract({
        path: this.pluginDirectory,
      })
    })

    console.log(`Finished extracting ${this.name}`)

    //Removes the downloaded file from the machine
    console.log(`Previous download removal started for ${this.name}`)
    await fs.promises.unlink(downloadFilename)
    console.log(`Previous download removal completed for ${this.name}`)

    await this.timeout(1000)

    console.log(`Install complete of ${this.name}`)
  }

  private addExtraFiles = async (files: FileDefinition[]) => {
    for (let file of files) {
      let filePath = path.join(this.pluginDirectory, file.filename)

      //Remove the existing file
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath)
      }

      let dir = path.dirname(filePath)

      await fs.promises.mkdir(dir, { recursive: true })

      await fs.promises.writeFile(filePath, file.contents)
    }
  }

  private timeout = (ms: number) => new Promise(res => setTimeout(res, ms))

  private onExit = async (code: number | null) => {
    console.log('exit: ' + code)
    let stopped = this.stopCalled
    this.stopCalled = false

    if (this.pluginDefinition.autoRestart === false) {
      console.log(`Auto restart is disabled for ${this.name}`)
      return
    }
    //If the plugin was intentionally stopped
    if (this.status === PluginStatus.Stopped || stopped) {
      return
    }

    await this.restart()
  }

  private onOutput = async (message: string) => {
    message = message.trim()

    //Check to see if we are in the running state
    if (new RegExp(this.pluginDefinition.runningCheck).test(message)) {
      this.status = PluginStatus.Running
      console.log('The running check was detected')
    }

    if (this.pluginDefinition.errors) {
      let error = this.pluginDefinition.errors.find(x => new RegExp(x.message).test(message))
      if (error) {
        //Sends out an error message
        this.notificationService.sendError({
          message: message,
          errorCode: error.errorCode,
          errorCategory: error.errorCategory,
        })

        switch (error.errorAction) {
          case ErrorAction.Stop:
            await this.stop()
            break
          case ErrorAction.Restart:
            await this.restart()
            break
          case ErrorAction.Ignore:
          default:
            break
        }
      }
    }
    console.log(message)
  }
}
