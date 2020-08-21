import * as Sentry from '@sentry/electron'
import { app, BrowserWindow, Input, ipcMain, powerMonitor, shell } from 'electron'
import { autoUpdater } from 'electron-updater'
import isOnline from 'is-online'
import * as notifier from 'node-notifier'
import * as path from 'path'
import * as si from 'systeminformation'
import { Config } from './config'
import * as Logger from './Logger'
import { MachineInfo } from './models/MachineInfo'
import { Profile } from './models/Profile'
import { PluginDefinition } from './salad-bowl/models/PluginDefinition'
import { PluginManager } from './salad-bowl/PluginManager'
import { SaladBridgeNotificationService } from './salad-bowl/SaladBridgeNotificationService'
import { SaladBridge } from './SaladBridge'
import { DefaultTheme as theme } from './SaladTheme'

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

const getMachineInfo = (): Promise<MachineInfo> => {
  return Promise.allSettled([
    si.cpu(),
    si.cpuFlags(),
    si.graphics(),
    si.memLayout(),
    si.osInfo(),
    si.services('*'),
    si.system(),
    si.uuid(),
    si.version(),
  ]).then(([cpu, cpuFlags, graphics, memLayout, osInfo, services, system, uuid, version]) => {
    let cpuData: si.Systeminformation.CpuData | si.Systeminformation.CpuWithFlagsData | undefined
    if (cpu.status === 'fulfilled') {
      if (cpuFlags.status === 'fulfilled') {
        cpuData = {
          ...cpu.value,
          flags: cpuFlags.value,
        }
      } else {
        cpuData = cpu.value
      }
    }

    return {
      version: version.status === 'fulfilled' ? version.value : undefined,
      system: system.status === 'fulfilled' ? system.value : undefined,
      cpu: cpuData,
      memLayout: memLayout.status === 'fulfilled' ? memLayout.value : undefined,
      graphics: graphics.status === 'fulfilled' ? graphics.value : undefined,
      os: osInfo.status === 'fulfilled' ? osInfo.value : undefined,
      uuid: uuid.status === 'fulfilled' ? uuid.value : undefined,
      services: services.status === 'fulfilled' ? services.value : undefined,
    }
  })
}

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
    return
  }

  if (mainWindow) {
    return
  }

  offlineWindow = new BrowserWindow({
    backgroundColor: theme.darkBlue,
    center: true,
    frame: false,
    height: 350,
    icon: './assets/favicon.ico',
    resizable: false,
    title: 'Salad',
    webPreferences: {
      enableRemoteModule: false,
    },
    width: 300,
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
    return
  }

  let maximized = false
  const saladAutoLauncher = new AutoLaunch({
    name: 'Salad',
  })

  mainWindow = new BrowserWindow({
    backgroundColor: theme.darkBlue,
    center: true,
    frame: false,
    icon: './assets/favicon.ico',
    minHeight: 766,
    minWidth: 1216,
    show: false,
    title: 'Salad',
    webPreferences: {
      contextIsolation: false,
      enableRemoteModule: false,
      nodeIntegration: false,
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
    mainWindow.show()
    if (offlineWindow) {
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
    getMachineInfoPromise = getMachineInfo().then((info) => {
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

  bridge.on('hide-window', () => {
    // TODO: Fix minimizing to the system tray.
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
    saladAutoLauncher.enable()
  })

  bridge.on('disable-auto-launch', () => {
    saladAutoLauncher.disable()
  })

  bridge.on('login', (profile: Profile) => {
    Sentry.configureScope((scope) => {
      scope.setUser({
        id: profile.id,
        email: profile.email,
        username: profile.username,
      })
    })
  })

  bridge.on('logout', () => {
    Sentry.configureScope((scope) => {
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
      (err) => {
        if (err) {
          console.warn('Notification error')
          console.warn(err)
        }
      },
    )
  })

  mainWindow.webContents.on('new-window', (e: Electron.Event, url: string) => {
    console.log(`opening new window at ${url}`)
    e.preventDefault()
    shell.openExternal(url)
  })

  mainWindow.webContents.on('console-message', (_: Electron.Event, level: number, message: string, line: number) => {
    console.log(`console:${line}:${level}:${message}`)
  })
}

const checkForUpdates = () => {
  //When we are online, check for updates
  if (updateChecked) {
    return
  }

  updateChecked = true
  console.log('Checking for updates...')

  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for update...')
  })
  autoUpdater.on('update-available', (info) => {
    console.log('Update available.' + info)
  })
  autoUpdater.on('update-not-available', (info) => {
    console.log('Update not available.' + info)
  })
  autoUpdater.on('error', (err) => {
    console.log('Error in auto-updater. ' + err)
  })
  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = 'Download speed: ' + progressObj.bytesPerSecond
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
    log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
    console.log(log_message)
  })
  autoUpdater.on('update-downloaded', (info) => {
    console.log('Update downloaded.' + info)
  })

  autoUpdater.logger = Logger.log
  autoUpdater.checkForUpdatesAndNotify()
}

const onReady = async () => {
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
