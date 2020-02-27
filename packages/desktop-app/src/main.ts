import { app, BrowserWindow, ipcMain, shell, Input, powerMonitor } from 'electron'
import { DefaultTheme as theme } from './SaladTheme'
import * as isOnline from 'is-online'
import * as path from 'path'
import * as si from 'systeminformation'
import { SaladBridge } from './SaladBridge'
import { Config } from './config'
import { MachineInfo } from './models/machine/MachineInfo'
import { autoUpdater } from 'electron-updater'
import { Logger } from './Logger'
import { exec } from 'child_process'
import * as fs from 'fs'
import { PluginManager } from './salad-bowl/PluginManager'
import { PluginDefinition } from './salad-bowl/models/PluginDefinition'
import { SaladBridgeNotificationService } from './salad-bowl/SaladBridgeNotificationService'
import * as Sentry from '@sentry/electron'
import { Profile } from './models/Profile'
import * as notifier from 'node-notifier'
import * as gpuInfo from '@saladtech/gpu-info';

console.log("Running with GPU-Info version:", gpuInfo.version());

const appVersion = app.getVersion()

Sentry.init({
  dsn: 'https://0a70874cde284d838a378e1cc3bbd963@sentry.io/1804227',
  release: appVersion,
})

/** Path to the /static folder. Provided via electron-webpack */
declare const __static: string

//Overrides the console.log behavior
Logger.connect()

const AutoLaunch = require('auto-launch')

const getDesktopVersion = 'get-desktop-version'
const setDesktopVersion = 'set-desktop-version'
const getIdleTime = 'get-idle-time'
const setIdleTime = 'set-idle-time'
const showNotification = 'show-notification'
const start = 'start-salad'
const stop = 'stop-salad'

let mainWindow: BrowserWindow
let offlineWindow: BrowserWindow

let machineInfo: MachineInfo
let updateChecked = false

let pluginManager: PluginManager | undefined

const getMachineInfo = () =>
  new Promise<MachineInfo>(() => {
    si.osInfo(os => {
      si.system(system => {
        si.graphics(graphics => {
          machineInfo = {
            system: system,
            os: os,
            graphics: graphics,
          }
        })
      })
    })
  })

/** Ensure only 1 instance of the app ever run */
const checkForMultipleInstance = () => {
  const gotTheLock = app.requestSingleInstanceLock()

  if (!gotTheLock) {
    app.quit()
  } else {
    app.on('second-instance', () => {
      // Someone tried to run a second instance, we should focus our window.
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore()
        mainWindow.focus()
      }
    })
  }
}

const createOfflineWindow = () => {
  if (offlineWindow) {
    console.log('Offline window already created. Skipping...')
    return
  }

  if (mainWindow) {
    console.log('Main window already being show. No need for an offline window. Skipping...')
    return
  }

  offlineWindow = new BrowserWindow({
    title: 'Salad',
    width: 300,
    height: 350,
    center: true,
    icon: './assets/favicon.ico',
    backgroundColor: theme.darkBlue,
    frame: false,
    resizable: false,
  })

  offlineWindow.loadURL(`file://${__static}/offline.html`)

  offlineWindow.on('close', () => {
    console.log('offline window close')
    app.quit()
  })
}

const createMainWindow = () => {
  if (mainWindow) {
    mainWindow.show()
    console.log('Main window already created. Skipping...')
    return
  }

  let maximized = false
  const saladAutoLauncher = new AutoLaunch({
    name: 'Salad',
  })

  mainWindow = new BrowserWindow({
    title: 'Salad',
    minWidth: 1216,
    minHeight: 766,
    center: true,
    backgroundColor: theme.darkBlue,
    icon: '../assets/favicon.ico',
    frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: path.resolve(__dirname, './preload.js'),
    },
  })

  mainWindow.loadURL(Config.appUrl)
  mainWindow.on('close', () => app.quit())

  mainWindow.webContents.on('before-input-event', (_: any, input: Input) => {
    if (input.type !== 'keyUp' || input.key !== 'F12') return
    mainWindow.webContents.toggleDevTools()
  })

  mainWindow.once('ready-to-show', () => {
    console.log('ready to show main window')
    mainWindow.show()

    if (offlineWindow) {
      console.log('Closing offline')
      offlineWindow.destroy()
    }
  })

  //Create the bridge to listen to messages from the web-app
  let bridge = new SaladBridge(mainWindow)
  let notificationService = new SaladBridgeNotificationService(bridge)
  let dataFolder = app.getPath('userData')
  console.log(`Path to Salad plugins:${dataFolder}`)
  pluginManager = new PluginManager(dataFolder, notificationService)

  ipcMain.on('js-dispatch', bridge.receiveMessage)

  var getMachineInfoPromise: Promise<void> | undefined = undefined

  //Listen for machine info requests
  bridge.on('get-machine-info', () => {
    //Return the cached machine info
    if (machineInfo) {
      bridge.send('set-machine-info', machineInfo)
    }

    //Prevent multiple `getMachineInfo` from being called at the same time
    if (getMachineInfoPromise !== undefined) return

    //Fetch the machine info
    getMachineInfoPromise = getMachineInfo().then(info => {
      machineInfo = info
      bridge.send('set-machine-info', machineInfo)
      getMachineInfoPromise = undefined
    })
  })

  bridge.on('minimize-window', () => {
    mainWindow.minimize()
    console.log('Minimizing window')
  })

  bridge.on('maximize-window', () => {
    if (!maximized) {
      mainWindow.maximize()
      maximized = true
      console.log('Maximizing window')
    } else {
      mainWindow.unmaximize()
      maximized = false
      console.log('Unmaximizing window')
    }
  })

  bridge.on('close-window', () => {
    console.log('Closing main window')
    app.quit()
  })

  bridge.on(start, (pluginDefinition: PluginDefinition) => {
    if (pluginManager) pluginManager.start(pluginDefinition)
  })

  bridge.on(stop, () => {
    if (pluginManager) pluginManager.stop()
  })

  bridge.on('send-log', (id: string) => {
    console.log('Sending logs')
    Logger.sendLog(id)
  })

  bridge.on(getDesktopVersion, () => {
    bridge.send(setDesktopVersion, app.getVersion())
  })

  bridge.on('enable-auto-launch', () => {
    console.log('Enable auto launch')
    saladAutoLauncher.enable()
  })

  bridge.on('disable-auto-launch', () => {
    console.log('Disable auto launch')
    saladAutoLauncher.disable()
  })

  bridge.on('login', (profile: Profile) => {
    Sentry.configureScope(scope => {
      scope.setUser({
        id: profile.id,
        email: profile.email,
        username: profile.username,
      })
    })
  })

  bridge.on('logout', () => {
    Sentry.configureScope(scope => {
      scope.setUser({})
    })
  })

  //Gets the current idle time
  bridge.on(getIdleTime, () => {
    let n = powerMonitor.getSystemIdleTime()
    bridge.send(setIdleTime, {
      time: n,
    })
  })

  bridge.on(showNotification, (message: {}) => {
    notifier.notify(
      {
        ...message,
        icon: path.join(__static, 'salad-logo.png'),
        appID: 'salad-technologies-desktop-app',
      },
      err => {
        if (err) {
          console.warn('Notification error')
          console.warn(err)
        }
      },
    )

    // notifier.on('timeout', () => {
    //   console.log('Timed out!')
    // })

    // notifier.on('click', () => {
    //   console.log('Clicked!')
    // })
  })

  mainWindow.webContents.on('new-window', (e: Electron.Event, url: string) => {
    console.log(`opening new window at ${url}`)
    e.preventDefault()
    shell.openExternal(url)
  })

  mainWindow.webContents.on('console-message', (_: Event, level: number, message: string, line: number) => {
    console.log(`console:${line}:${level}:${message}`)
  })
}

const checkForUpdates = () => {
  //When we are online, check for updates
  if (updateChecked) {
    console.log('Already checked for updates. Skipping')
    return
  }
  updateChecked = true
  console.log('Checking for updates...')

  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for update...')
  })
  autoUpdater.on('update-available', info => {
    console.log('Update available.' + info)
  })
  autoUpdater.on('update-not-available', info => {
    console.log('Update not available.' + info)
  })
  autoUpdater.on('error', err => {
    console.log('Error in auto-updater. ' + err)
  })
  autoUpdater.on('download-progress', progressObj => {
    let log_message = 'Download speed: ' + progressObj.bytesPerSecond
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
    log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
    console.log(log_message)
  })
  autoUpdater.on('update-downloaded', info => {
    console.log('Update downloaded.' + info)
  })

  autoUpdater.logger = Logger.log
  autoUpdater.checkForUpdatesAndNotify()
}

const onReady = async () => {
  //Start loading the machine info
  getMachineInfo()
  getCudaData()

  //Check to see if we are online
  let online = await isOnline()

  if (online) {
    createMainWindow()

    checkForUpdates()

    //Online
  } else {
    //Not online
    createOfflineWindow()
  }
}

const getCudaData = () => {
  const System32Path = 'C:\\Windows\\System32'
  const ProgramFilesPath = 'C:\\Program Files\\NVIDIA Corporation\\NVSMI'
  let path: string | undefined = undefined

  // TODO:  Possibly need to find where other sources of nvidia-smi.exe live
  //        if it's not in the current directories.
  if (fs.existsSync(`${System32Path}\\nvidia-smi.exe`)) {
    path = System32Path
  } else if (fs.existsSync(`${ProgramFilesPath}\\nvidia-smi.exe`)) {
    path = ProgramFilesPath
  } else {
    return
  }

  // Useful nvidia-smi Queries: https://nvidia.custhelp.com/app/answers/detail/a_id/3751/~/useful-nvidia-smi-queries
  const query_gpu = '--query-gpu=name,temperature.gpu,utilization.gpu,utilization.memory,driver_version'
  const cmd = `nvidia-smi.exe ${query_gpu} --format=csv`

  exec(cmd, { cwd: path }, (error, data) => {
    console.log('cuda error: ', error)
    console.log('cuda data: ', data)
  })
}

checkForMultipleInstance()

app.on('ready', () => onReady())

app.on('will-quit', () => {
  console.log('will quit')
  if (pluginManager) pluginManager.stop()
})

process.on('exit', () => {
  console.log('Process exit')
  if (pluginManager) pluginManager.stop()
})

app.on('window-all-closed', () => {
  console.log('window-all-closed')
  if (process.platform != 'darwin') {
    app.quit()
  }
})

const cleanExit = () => {
  console.log('clean-exit')
  if (pluginManager) pluginManager.stop()
  process.exit()
}

process.on('SIGINT', cleanExit) // catch ctrl-c
process.on('SIGTERM', cleanExit) // catch kill
console.log(`Running ${app.name} ${appVersion}`)
