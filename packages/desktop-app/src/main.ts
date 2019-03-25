import { app, BrowserWindow, ipcMain } from 'electron'
import { DefaultTheme as theme } from './SaladTheme'
import * as path from 'path'
import * as si from 'systeminformation'
import { SaladBridge } from './SaladBridge'
import { Config } from './config'

let mainWindow: Electron.BrowserWindow

function onReady() {
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
    mainWindow.show()
  })

  //Create the bridge to listen to messages from the web-app
  let bridge = new SaladBridge(mainWindow)
  ipcMain.on('js-dispatch', bridge.receiveMessage)

  //Listen for machine info requests
  bridge.on('get-machine-info', () => {
    si.graphics().then(graphics => {
      si.osInfo().then(os => {
        bridge.send('set-machine-info', {
          os: os,
          gpus: graphics.controllers,
        })
      })
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
}

app.on('ready', () => onReady())
app.on('window-all-closed', () => app.quit())
console.log(`Electron Version ${app.getVersion()}`)
