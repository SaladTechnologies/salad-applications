import { action, observable } from 'mobx'
import { TokenData } from './models'
import * as Storage from '../../Storage'

const SALAD_TOKEN = 'NEW_TOKEN'

export class TokenStore {
  @observable
  public saladToken: string = ''

  constructor() {
    this.getAndSetToken()
  }

  @action
  private getAndSetToken = () => {
    const saladToken = Storage.getItem(SALAD_TOKEN)

    if (saladToken) {
      this.saladToken = saladToken
    }
  }

  @action
  setToken = (saladToken: string) => {
    Storage.setItem(SALAD_TOKEN, saladToken)
    this.saladToken = saladToken
  }

  getTokenData = (): TokenData => {
    const saladToken = this.saladToken
    const token = saladToken.split('.')[1]
    const Base64Token: string = new Buffer(token, 'base64').toString()
    const tokenData = JSON.parse(Base64Token)

    return tokenData
  }

  getTokenExpiration = (): number => {
    const token = this.getTokenData()
    const expires = token.exp
    let expirationDate: any = new Date(expires * 1000)
    let expiresInDays = Math.floor((expirationDate - Date.now()) / (1000 * 60 * 60 * 24))

    return expiresInDays
  }

  getMachineId = () => {
    const token = this.getTokenData()
    return token && token.pc
  }
}
