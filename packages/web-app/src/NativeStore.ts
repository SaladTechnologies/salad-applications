import { action, observable } from 'mobx'

const getMachineInfo = 'get-machine-info'
const setMachineInfo = 'set-machine-info'
const runStatus = 'run-status'
const minimize = 'minimize-window'
const maximize = 'maximize-window'
const close = 'close-window'
const start = 'start-salad'
const stop = 'stop-salad'

declare global {
  interface Window {
    salad: {
      platform: string
      apiVersion: number
      dispatch: (type: string, payload: any) => void
      onNative: (args: { type: string; payload: any }) => void
    }
  }
}

export class NativeStore {
  private callbacks = new Map<string, Function>()

  @observable
  public isRunning: boolean = false

  get isNative(): boolean {
    return window.salad && window.salad.platform === 'electron'
  }

  constructor() {
    if (this.isNative) {
      window.salad.onNative = this.onNative

      this.on(runStatus, (status: boolean) => {
        console.log('Received run status: ' + status)
        this.setRunStatus(status)
      })

      //TODO: Set some machine info in there
      this.on(setMachineInfo, () => {
        console.log('Received machine info')
      })
    }
  }

  private onNative = (args: { type: string; payload: any }) => {
    let func = this.callbacks.get(args.type)

    if (func) {
      console.log('Received message ' + args.type)
      func(args.payload)
    } else {
      console.log('Recevied unhandled message type ' + args.type)
    }
  }

  public on = (type: string, listener: Function) => {
    this.callbacks.set(type, listener)
  }

  public send = (type: string, payload?: any) => {
    if (!this.isNative) {
      console.warn('Unable to send. Not running in electron env.')
      return
    }
    window.salad.dispatch(type, payload)
  }

  @action
  setRunStatus = (status: boolean) => {
    this.isRunning = status
  }

  @action
  loadMachineInfo = () => {
    this.send(getMachineInfo)
  }

  @action
  minimizeWindow = () => {
    this.send(minimize)
  }

  @action
  maximizeWindow = () => {
    this.send(maximize)
  }

  @action
  closeWindow = () => {
    this.send(close)
  }

  @action
  start = () => {
    this.send(start)
  }

  @action
  stop = () => {
    this.send(stop)
  }

  @action
  toggleRunning = () => {
    if (this.isRunning) {
      this.send(stop)
    } else {
      this.send(start)
    }
  }
}
