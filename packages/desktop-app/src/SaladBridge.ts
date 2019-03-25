import { BrowserWindow } from 'electron'

export class SaladBridge {
  private callbacks = new Map<string, Function>()
  constructor(private readonly window: BrowserWindow) {}

  receiveMessage = (_: any, args: { type: string; payload: any }) => {
    let func = this.callbacks.get(args.type)

    if (func) {
      console.log('Received message ' + args.type)
      func(args.payload)
    } else {
      console.log('Recevied unhandled message type ' + args.type)
    }
  }

  send = (type: string, payload?: any) => {
    this.window.webContents.send('native-dispatch', { type: type, payload: payload })
  }

  on = (type: string, listener: Function) => {
    this.callbacks.set(type, listener)
  }
}
