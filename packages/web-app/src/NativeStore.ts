import { action } from 'mobx'

const getMachineInfo = 'get-machine-info'

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
  get isNative(): boolean {
    return window.salad && window.salad.platform === 'electron'
  }

  constructor() {
    if (this.isNative) {
      window.salad.onNative = this.onNative
    }
  }

  onNative = (args: { type: string; payload: any }) => {
    console.log('Received onNative')
  }

  public send = (type: string, payload?: any) => {
    if (!this.isNative) {
      console.warn('Unable to send. Not running in electron env.')
      return
    }
    window.salad.dispatch(type, payload)
  }

  @action
  loadMachineInfo = () => {
    this.send(getMachineInfo)
  }
}
