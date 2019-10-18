const { ipcRenderer: ipc } = require('electron')

init()

/**
 * API Versions
 * 1 - Original
 * 2 - Auto launch
 * 3 - Pass the mining address
 * 4 - Nicepool
 * 5 - Salad Bowl
 */

function init() {
  console.log('Injecting Salad bridge')

  window.salad = {
    platform: 'electron',
    apiVersion: 5,
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
