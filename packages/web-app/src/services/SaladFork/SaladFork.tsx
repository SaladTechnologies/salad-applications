import { SaladBowlMessages, SaladBowlServices } from '@saladtechnologies/salad-grpc-salad-bowl'
import type { AxiosInstance } from 'axios'
import type { SaladBowlLoginResponse } from './models/SaladBowlLoginResponse'
import { SaladBowlLoginResponseError } from './models/SaladBowlLoginResponse'
import { SaladBowlLogoutResponse, SaladBowlLogoutResponseError } from './models/SaladBowlLogoutResponse'

export interface SaladForkInterface {
  login: () => Promise<SaladBowlLoginResponse>
  logout: () => Promise<SaladBowlLogoutResponse>
}

export class SaladFork implements SaladForkInterface {
  readonly client: SaladBowlServices.SaladBowlServicePromiseClient

  constructor(private readonly axios: AxiosInstance) {
    const server: string = 'http://localhost:5000' // make env variable
    this.client = new SaladBowlServices.SaladBowlServicePromiseClient(server)
  }

  public login = async (): Promise<SaladBowlLoginResponse> => {
    try {
      const response = await this.axios.post('/api/v2/saladbowl/auth/login')

      if (response.data) {
        const jwt: string = response.data

        const request = new SaladBowlMessages.LoginRequest()
        request.setJwt(jwt)
        const loginResponse = await this.client.login(request)

        if (loginResponse.getSuccess()) {
          return Promise.resolve()
        } else {
          return Promise.reject(SaladBowlLoginResponseError.unableToLoginToSaladBowl)
        }
      } else {
        return Promise.reject(SaladBowlLoginResponseError.unableToRetrieveJWT)
      }
    } catch (error) {
      return Promise.reject(SaladBowlLoginResponseError.unableToRetrieveJWT)
    }
  }

  public logout = async (): Promise<SaladBowlLogoutResponse> => {
    const request = new SaladBowlMessages.LogoutRequest()
    return await this.client
      .logout(request)
      .then(() => Promise.resolve())
      .catch(() => Promise.reject(SaladBowlLogoutResponseError.unableToLoginToSaladBowl))
  }
}
