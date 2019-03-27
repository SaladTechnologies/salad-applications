import { app, BrowserWindow, ipcMain } from 'electron'
import { DefaultTheme as theme } from './SaladTheme'
import * as path from 'path'
import * as si from 'systeminformation'
import { SaladBridge } from './SaladBridge'
import { Config } from './config'
import { Ethminer } from './Ethminer'
import { MachineInfo } from './models/MachineInfo'

let mainWindow: Electron.BrowserWindow
let machineInfo: MachineInfo
let ethminer = new Ethminer()

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

const onReady = () => {
  mainWindow = new BrowserWindow({
    title: 'Daniel',
    minWidth: 1216,
    minHeight: 766,
    center: true,
    backgroundColor: theme.darkBlue,
    icon: './assets/favicon.ico',
    frame: false,
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
    //Pre-fetch the machine info
    getMachineInfo()
    mainWindow.show()
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
  })

  bridge.on('maximize-window', () => {
    if (!mainWindow.isMaximized()) {
      mainWindow.maximize()
    } else {
      mainWindow.unmaximize()
    }
  })

  bridge.on('close-window', () => {
    mainWindow.close()
  })

  bridge.on('start', () => {
    console.log('Starting salad')

    if (machineInfo) {
      ethminer.start(machineInfo)
    } else {
      getMachineInfo().then(info => {
        ethminer.start(info)
      })
    }
  })

  bridge.on('stop', () => {
    console.log('Stopping salad')
    ethminer.stop()
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
