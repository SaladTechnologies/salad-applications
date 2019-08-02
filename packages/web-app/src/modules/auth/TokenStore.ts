import { action, observable } from 'mobx'
import * as Storage from '../../Storage'

const SALAD_TOKEN = 'TOKEN'

interface TokenData {
  sub: string
  iat: number
  pc: string
  exp: number
  iss: string
  aud: string
}

interface TokenStringWithExpiration {
  saladToken: string | undefined
  expires: number
}

export class TokenStore {
  @observable
  public saladToken: string = ''

  @action
  getToken = () => this.saladToken || Storage.getItem(SALAD_TOKEN)

  @action
  setToken = (saladToken: string) => {
    Storage.setItem(SALAD_TOKEN, saladToken)
    this.saladToken = saladToken
  }

  @action
  getTokenData = (): TokenData | null => {
    const saladToken = this.saladToken
    const token = saladToken.split('.')[1]
    const Base64Token: string = new Buffer(token, 'base64').toString()
    const tokenData = JSON.parse(Base64Token)

    return tokenData
  }

  @action
  getTokenExpiration = (): TokenStringWithExpiration | null => {
    const token = this.getTokenData()
    let tokenWithExpiration: TokenStringWithExpiration | null = null

    if (token) {
      const expires = token.exp
      let expirationDate: any = new Date(expires * 1000)
      let expiresInDays = Math.floor((expirationDate - Date.now()) / (1000 * 60 * 60 * 24))

      tokenWithExpiration = { saladToken: this.saladToken, expires: expiresInDays }
    }

    return tokenWithExpiration
  }

  @action
  getMachineId = () => {
    const token = this.getTokenData()
    return token && token.pc
  }
}
