const { ipcRenderer: ipc } = require('electron')
const process = require('process')

init()

/**
 * API Versions
 * 1 - Original
 * 2 - Auto launch
 * 3 - Pass the mining address
 * 4 - Nicepool
 * 5 - Salad Bowl (C#)
 * 6 - Salad Bowl (TS)
 * 7 - Get Idle Time
 * 8 - Minimize to Tray
 * 9 - Added Windows Defender Whitelist & Disable Sleep Mode
 */

function init() {
  console.log('Injecting Salad bridge')

  window.salad = {
    platform: process.platform,
    apiVersion: 9,
    dispatch: dispatch,
  }

  //Callback when receiving a message from electron
  ipc.on('native-dispatch', (event, args) => {
    if (window.salad.onNative) {
      window.salad.onNative(args)
    } else {
      console.warn('Missing window.salad.onNative, unable to receive messages')
    }
  })
}

//Sends a message to electron
function dispatch(type, payload) {
  ipc.send('js-dispatch', { type: type, payload: payload })
}
