import { app, BrowserWindow, ipcMain } from 'electron'
import { DefaultTheme as theme } from './SaladTheme'
import * as path from 'path'
import * as si from 'systeminformation'
import { SaladBridge } from './SaladBridge'
import { Config } from './config'
import { Ethminer } from './Ethminer'
import { MachineInfo } from './models/MachineInfo'

const runStatus = 'run-status'

let mainWindow: BrowserWindow
let onlineStatusWindow: BrowserWindow
let offlineWindow: BrowserWindow

let machineInfo: MachineInfo
let ethminer = new Ethminer()
let onlineStatus = false

const getMachineInfo = () =>
  new Promise<MachineInfo>((resolve, reject) => {
    si.graphics()
      .then(graphics => {
        si.system().then(net => {
          console.log(net)
          si.osInfo().then(os => {
            //TODO: Figure out what mac/UUID we are going to use
            machineInfo = {
              os: os,
              gpus: graphics.controllers,
            }
            resolve(machineInfo)
          })
        })
      })
      .catch(() => reject())
  })

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

  offlineWindow.loadURL(`file://${__dirname}/offline.html`)

  offlineWindow.on('close', () => {
    console.log('offline window close')
  })
}

const createMainWindow = () => {
  if (mainWindow) {
    mainWindow.show()
    console.log('Main window already created. Skipping...')
    return
  }

  let maximized = false

  mainWindow = new BrowserWindow({
    title: 'Salad',
    minWidth: 1400,
    minHeight: 760,
    center: true,
    backgroundColor: theme.darkBlue,
    icon: './assets/favicon.ico',
    frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: path.resolve(__dirname, './preload.js'),
    },
  })

  mainWindow.webContents.openDevTools()
  mainWindow.loadURL(Config.appUrl)
  mainWindow.on('close', () => app.quit())
  mainWindow.once('ready-to-show', () => {
    console.log('ready to show main window')
    //Pre-fetch the machine info
    getMachineInfo()
    mainWindow.show()

    if (offlineWindow) {
      console.log('Closing offline')
      offlineWindow.destroy()
    }
  })

  //Create the bridge to listen to messages from the web-app
  let bridge = new SaladBridge(mainWindow)
  ipcMain.on('js-dispatch', bridge.receiveMessage)

  //Listen for machine info requests
  bridge.on('get-machine-info', () => {
    //Return the cached machine info
    if (machineInfo) {
      bridge.send('set-machine-info', machineInfo)
    }

    //Fetch the machine info
    getMachineInfo().then(info => {
      machineInfo = info
      bridge.send('set-machine-info', machineInfo)
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

  bridge.on('start-salad', () => {
    console.log('Starting salad')

    if (machineInfo) {
      ethminer.start(machineInfo)
      bridge.send(runStatus, true)
    } else {
      getMachineInfo().then(info => {
        ethminer.start(info)
        bridge.send(runStatus, true)
      })
    }
  })

  bridge.on('stop-salad', () => {
    console.log('Stopping salad')
    ethminer.stop()
    bridge.send(runStatus, false)
  })
}

const onReady = () => {
  //Create a window to check the online status
  onlineStatusWindow = new BrowserWindow({ width: 0, height: 0, show: false })
  onlineStatusWindow.loadURL(`file://${__dirname}/online-status.html`)

  ipcMain.on('online-status-changed', (_: any, status: boolean) => {
    onlineStatus = status //TODO: Fix this
    // onlineStatus = false
    console.log('Online status updated: ' + status)

    //If we are online, show the main app
    if (onlineStatus) {
      createMainWindow()
    } else {
      createOfflineWindow()
    }
  })
}

app.on('ready', () => onReady())
app.on('will-quit', () => {
  console.log('will quit')
  ethminer.stop()
})

process.on('exit', () => {
  console.log('Process exit')
  ethminer.stop()
})

app.on('window-all-closed', () => {
  console.log('window-all-closed')
  if (process.platform != 'darwin') {
    app.quit()
  }
})

const cleanExit = () => {
  console.log('clean-exit')
  process.exit()
}
process.on('SIGINT', cleanExit) // catch ctrl-c
process.on('SIGTERM', cleanExit) // catch kill

console.log(`Electron Version ${app.getVersion()}`)
