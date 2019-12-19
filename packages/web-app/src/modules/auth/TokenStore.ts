import { action, observable, computed } from 'mobx'
import { TokenData } from './models'
import * as Storage from '../../Storage'

export const SALAD_TOKEN = 'NEW_TOKEN'

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

  @computed
  get tokenData(): TokenData | undefined {
    const saladToken = this.saladToken

    //Ensure there is a valid token
    if (!saladToken) return undefined

    //Split the jwt into its parts (header, payload...)
    const parts = saladToken.split('.')

    //Ensure that the jwt has a payload
    if (!parts || parts.length <= 1) return undefined

    const payload = parts[1]

    if (!payload) return undefined

    const base64Payload: string = atob(payload)

    const tokenData = JSON.parse(base64Payload)

    return tokenData
  }

  /** Returns the number of days until the token expires */
  @computed
  get tokenExpiration(): number {
    const token = this.tokenData

    //Returns that the token has expired
    if (!token) return 0

    const expires = token.exp
    let expirationDate: any = new Date(expires * 1000)
    let expiresInDays = Math.floor((expirationDate - Date.now()) / (1000 * 60 * 60 * 24))

    return expiresInDays
  }

  @computed
  get machineId(): string | undefined {
    const token = this.tokenData
    return token && token.pc
  }
}
