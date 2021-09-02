import * as Sentry from '@sentry/electron'
import { exec } from 'child_process'
import {
  app,
  BrowserWindow,
  Input,
  ipcMain,
  Menu,
  nativeImage,
  nativeTheme,
  Notification,
  powerMonitor,
  shell,
  Tray,
} from 'electron'
import { autoUpdater } from 'electron-updater'
import { MenuItemConstructorOptions } from 'electron/main'
import { WindowsToaster } from 'node-notifier'
import * as os from 'os'
import * as path from 'path'
import process from 'process'
import * as si from 'systeminformation'
import { APP_URL } from './config'
import * as icons from './icons'
import * as Logger from './Logger'
import { MachineInfo } from './models/MachineInfo'
import { Profile } from './models/Profile'
import { PluginDefinition } from './salad-bowl/models/PluginDefinition'
import { PluginStatus } from './salad-bowl/models/PluginStatus'
import { PluginManager } from './salad-bowl/PluginManager'
import { SaladBridgeNotificationService } from './salad-bowl/SaladBridgeNotificationService'
import { SaladBridge } from './SaladBridge'
import { DefaultTheme as theme } from './SaladTheme'
import { powershellWhitelistCommand } from './whitelistWindowsScript'
import isOnline = require('is-online')

// The path to the `/static` folder. This is provided by electron-webpack.
declare const __static: string

// Disable GPU acceleration.
app.disableHardwareAcceleration()

// Register to send Windows 10 notifications.
app.setAppUserModelId('salad-technologies-desktop-app')

// Capture unhandled errors.
Sentry.init({
  dsn: 'https://0a70874cde284d838a378e1cc3bbd963@sentry.io/1804227',
  release: app.getVersion(),
})

// Redirect `console` to the application log file.
Logger.connect()

// Ensure we have the correct path to `snoretoast.exe`. Note: Kyle _hates_ this.
var notifier = new WindowsToaster({
  withFallback: false,
  customPath: path
    .resolve(
      app.getAppPath(),
      'node_modules/node-notifier/vendor/snoreToast/snoretoast-x' + (os.arch() === 'x64' ? '64' : '86') + '.exe',
    )
    .replace('app.asar', 'app.asar.unpacked'),
})

const AutoLaunch = require('auto-launch')

const getDesktopVersion = 'get-desktop-version'
const setDesktopVersion = 'set-desktop-version'
const getIdleTime = 'get-idle-time'
const setIdleTime = 'set-idle-time'
const showNotification = 'show-notification'
const start = 'start-salad'
const stop = 'stop-salad'

let machineInfo: Promise<MachineInfo> | undefined
let mainWindow: BrowserWindow
let offlineWindow: BrowserWindow
let pluginManager: PluginManager | undefined
let activeIconEnabled = false
let tray: Tray
let updateChecked = false
let darkTheme = nativeTheme.shouldUseDarkColors

const getMachineInfo = (): Promise<MachineInfo> => {
  return Promise.allSettled([
    si.cpu(),
    si.graphics(),
    si.memLayout(),
    si.osInfo(),
    si.services('*'),
    si.system(),
    si.uuid(),
    si.version(),
    si.processes(),
  ]).then(([cpu, graphics, memLayout, osInfo, services, system, uuid, version, processes]) => {
    return {
      version: version.status === 'fulfilled' ? version.value : undefined,
      system: system.status === 'fulfilled' ? system.value : undefined,
      cpu: cpu.status === 'fulfilled' ? cpu.value : undefined,
      memLayout: memLayout.status === 'fulfilled' ? memLayout.value : undefined,
      graphics: graphics.status === 'fulfilled' ? graphics.value : undefined,
      os: osInfo.status === 'fulfilled' ? osInfo.value : undefined,
      platform: process.platform,
      processes: processes.status === 'fulfilled' ? processes.value : undefined,
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
        if (!mainWindow.isVisible()) {
          mainWindow.show()
          if (process.platform === 'darwin') {
            app.dock.show()
          }
        }

        if (mainWindow.isMinimized()) {
          mainWindow.restore()
        }

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
    icon: icons.WINDOW_ICON_PATH,
    resizable: false,
    title: 'Salad',
    width: 300,
  })

  offlineWindow.loadURL(`file://${__static}/offline.html`)

  offlineWindow.on('close', () => {
    console.log('offline window close')
    app.quit()
  })
}

const createMainMenu = () => {
  if (process.platform === 'darwin') {
    const template: MenuItemConstructorOptions[] | null = [
      { role: 'appMenu' },
      { role: 'editMenu' },
      { role: 'windowMenu' },
      {
        role: 'help',
        submenu: [
          {
            label: 'Learn More',
            click: () => shell.openExternal('https://salad.com'),
          },
          {
            label: 'Support',
            click: () => shell.openExternal('https://support.salad.com'),
          },
        ],
      },
    ]
    Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  } else {
    Menu.setApplicationMenu(null)
  }
}

const createMainWindow = () => {
  if (mainWindow) {
    if (tray) {
      tray.setContextMenu(createSystemTrayMenu(true))
    }

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
    height: 1216,
    icon: icons.WINDOW_ICON_PATH,
    minHeight: 766,
    minWidth: 1216,
    show: false,
    title: 'Salad',
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: false,
      preload: path.resolve(__dirname, './preload.js'),
    },
    width: 1216,
  })

  mainWindow.loadURL(APP_URL)
  mainWindow.on('close', () => app.quit())

  mainWindow.webContents.on('before-input-event', (_: any, input: Input) => {
    if (input.type !== 'keyUp' || input.key !== 'F12') return
    mainWindow.webContents.toggleDevTools()
  })

  mainWindow.once('ready-to-show', () => {
    tray = new Tray(nativeImage.createFromPath(darkTheme ? icons.DARK_TRAY_ICON_PATH : icons.TRAY_ICON_PATH))
    tray.setContextMenu(createSystemTrayMenu(true))
    tray.setToolTip('Salad')
    tray.on('double-click', () => {
      if (mainWindow) {
        if (mainWindow.isVisible()) {
          tray.setContextMenu(createSystemTrayMenu(false))
          mainWindow.hide()
          if (process.platform === 'darwin') {
            app.dock.hide()
          }
        } else {
          tray.setContextMenu(createSystemTrayMenu(true))
          mainWindow.show()
          if (process.platform === 'darwin') {
            app.dock.show()
          }
        }
      }
    })

    mainWindow.show()

    if (offlineWindow) {
      offlineWindow.destroy()
    }
  })

  //Create the bridge to listen to messages from the web-app
  let bridge = new SaladBridge(mainWindow)
  let notificationService = new SaladBridgeNotificationService(bridge, (status) => {
    if (status === PluginStatus.Initializing || status === PluginStatus.Installing || status === PluginStatus.Running) {
      if (!activeIconEnabled) {
        activeIconEnabled = true
        if (mainWindow) {
          if (process.platform === 'win32') {
            mainWindow.setOverlayIcon(
              nativeImage.createFromPath(icons.TASKBAR_ACTIVE_OVERLAY_ICON_PATH),
              'Background Tasks Running',
            )
          } else if (process.platform === 'linux') {
            // TODO: Add Linux-specific icon management
          } else if (process.platform === 'darwin') {
            app.dock.setIcon(nativeImage.createFromPath(icons.DOCK_ACTIVE_ICON_PATH))
          }
        }

        if (tray) {
          tray.setImage(
            nativeImage.createFromPath(darkTheme ? icons.DARK_TRAY_ACTIVE_ICON_PATH : icons.TRAY_ACTIVE_ICON_PATH),
          )
        }
      }
    } else {
      if (activeIconEnabled) {
        activeIconEnabled = false
        if (mainWindow) {
          if (process.platform === 'win32') {
            mainWindow.setOverlayIcon(null, '')
          } else if (process.platform === 'linux') {
            // TODO: Add Linux-specific icon management
          } else if (process.platform === 'darwin') {
            app.dock.setIcon(nativeImage.createFromPath(icons.DOCK_ICON_PATH))
          }
        }

        if (tray) {
          tray.setImage(nativeImage.createFromPath(darkTheme ? icons.DARK_TRAY_ICON_PATH : icons.TRAY_ICON_PATH))
        }
      }
    }
  })

  let dataFolder = app.getPath('userData')
  console.log(`Path to Salad plugins:${dataFolder}`)
  pluginManager = new PluginManager(dataFolder, notificationService)

  ipcMain.on('js-dispatch', bridge.receiveMessage)

  bridge.on('disable-sleep-mode', () => {
    const powercfg = 'C:\\Windows\\System32\\powercfg.exe'
    exec(
      `${powercfg} /list`,
      {
        env: {},
        timeout: 60000,
        windowsHide: true,
      },
      (error, stdout, stderr) => {
        if (error == null) {
          const profiles = [...stdout.matchAll(/\:\s+([^\s]+)/g)]
          disableSleepMode(profiles.shift())

          function disableSleepMode(profile: RegExpMatchArray | undefined) {
            if (profile) {
              // 238c9fa8-0aad-41ed-83f4-97be242c8f20 = GUID that identifies the groups of settings related to sleep mode
              // 29f6c1db-86da-48c5-9fdb-f2b67b1f44da = GUID that sets the sleep time in seconds. 0 disables completely
              exec(
                `${powercfg} /setacvalueindex ${profile[1]} 238c9fa8-0aad-41ed-83f4-97be242c8f20 29f6c1db-86da-48c5-9fdb-f2b67b1f44da 0`,
                {
                  env: {},
                  timeout: 60000,
                  windowsHide: true,
                },
                (error, _stdout, stderr) => {
                  if (error == null) {
                    disableSleepMode(profiles.shift())
                  } else {
                    console.error(
                      `Failed to set preference on Windows power profile ${profile[1]} (${error.message}${
                        error.code == null ? '' : `, exit code ${error.code}`
                      })${stderr ? `\n${stderr}` : ''}`,
                    )
                    bridge.send('disable-sleep-mode', {
                      success: false,
                    })
                  }
                },
              )
            } else {
              bridge.send('disable-sleep-mode', {
                success: true,
              })
            }
          }
        } else {
          console.error(
            `Failed to list Windows power profiles (${error.message}${
              error.code == null ? '' : `, exit code ${error.code}`
            })${stderr ? `\n${stderr}` : ''}`,
          )
          bridge.send('disable-sleep-mode', {
            success: false,
          })
        }
      },
    )
  })

  //Listen for machine info requests
  bridge.on('get-machine-info', () => {
    if (machineInfo === undefined) {
      machineInfo = getMachineInfo()
    }

    machineInfo.then((info) => {
      bridge.send('set-machine-info', info)
    })
  })

  bridge.on('whitelist-windows-defender', (filePath?: string) => {
    if (!filePath) {
      if (!process.env.APPDATA) {
        console.error(
          `Failed to Whitelist Windows Defender because the user's APPDATA environment variable has not been defined`,
        )
        bridge.send('whitelist-windows-defender', { error: true })
        return
      }
      filePath = path.join(process.env.APPDATA, 'Salad/plugin-bin')
    }
    exec(
      powershellWhitelistCommand,
      {
        env: {
          WHITELIST_DIR: filePath,
        },
        timeout: 60000,
        windowsHide: true,
      },
      (error, _stdout, stderr) => {
        if (error) {
          console.error(
            `Failed to Whitelist Windows Defender (${error.message}${
              error.code == null ? '' : `, exit code ${error.code}`
            })${stderr ? `\n${stderr}` : ''}`,
          )
          bridge.send('whitelist-windows-defender', {
            error: true,
            errorCode: error.code,
          })
        } else {
          bridge.send('whitelist-windows-defender', {})
        }
      },
    )
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
    if (mainWindow && mainWindow.isVisible()) {
      tray.setContextMenu(createSystemTrayMenu(false))
      mainWindow.hide()
      if (process.platform === 'darwin') {
        app.dock.hide()
      }
    }
  })

  bridge.on(start, (pluginDefinition: PluginDefinition) => {
    if (pluginManager) pluginManager.start(pluginDefinition)
  })

  bridge.on(stop, () => {
    if (pluginManager) pluginManager.stop()
  })

  bridge.on(getDesktopVersion, () => {
    bridge.send(setDesktopVersion, app.getVersion())
  })

  bridge.on('open-log-folder', (filePath?: string) => {
    const path = filePath ? filePath : Logger.getLogFolder()
    shell.showItemInFolder(path)
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

  bridge.on(showNotification, (message: { title: string; message: string }) => {
    if (process.platform === 'win32') {
      notifier.notify(
        {
          ...message,
          icon: icons.NOTIFICATION_ICON_PATH,
          appID: 'salad-technologies-desktop-app',
        },
        (err) => {
          if (err) {
            console.warn('Notification error')
            console.warn(err)
          }
        },
      )
    } else if (Notification.isSupported()) {
      let notification = new Notification({
        title: message.title,
        body: message.message,
        icon: icons.NOTIFICATION_ICON_PATH,
      })
      notification.show()
    }
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
  createMainMenu()
  if (await isOnline({ timeout: 10000 })) {
    createMainWindow()
    checkForUpdates()
  } else {
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
console.log(`Running ${app.name} ${app.getVersion()}`)

function createSystemTrayMenu(isVisible: boolean): Menu {
  return Menu.buildFromTemplate([
    {
      label: isVisible ? 'Hide Salad Window' : 'Show Salad Window',
      click: isVisible
        ? () => {
            if (mainWindow) {
              tray.setContextMenu(createSystemTrayMenu(false))
              mainWindow.hide()
              if (process.platform === 'darwin') {
                app.dock.hide()
              }
            }
          }
        : () => {
            if (mainWindow) {
              tray.setContextMenu(createSystemTrayMenu(true))
              mainWindow.show()
              if (process.platform === 'darwin') {
                app.dock.show()
              }
            }
          },
    },
    { type: 'separator' },
    {
      label: 'Exit',
      click: () => {
        app.quit()
      },
    },
  ])
}

nativeTheme.on('updated', () => {
  darkTheme = nativeTheme.shouldUseDarkColors
  if (tray) {
    if (activeIconEnabled) {
      tray.setImage(
        nativeImage.createFromPath(darkTheme ? icons.DARK_TRAY_ACTIVE_ICON_PATH : icons.TRAY_ACTIVE_ICON_PATH),
      )
    } else {
      tray.setImage(nativeImage.createFromPath(darkTheme ? icons.DARK_TRAY_ICON_PATH : icons.TRAY_ICON_PATH))
    }
  }
})
