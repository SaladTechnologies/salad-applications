import { SaladBowlMessages, SaladBowlServices } from '@saladtechnologies/salad-grpc-salad-bowl'
import type { AxiosInstance } from 'axios'

export interface SaladForkInterface {
  login: () => Promise<void>
  logout: () => void
  isAuthenticated: boolean
  authenticationPending: boolean
  authenticationError: boolean
}

export class SaladFork implements SaladForkInterface {
  readonly client: SaladBowlServices.SaladBowlServicePromiseClient

  public isAuthenticated = false
  public authenticationPending = false
  public authenticationError = false

  constructor(private readonly axios: AxiosInstance) {
    const server: string = 'http://localhost:5000' // make env variable
    this.client = new SaladBowlServices.SaladBowlServicePromiseClient(server)
  }

  public login = async () => {
    try {
      this.authenticationPending = true
      const response = await this.axios.post('/api/v2/saladbowl/auth/login')

      if (response.data) {
        const jwt: string = response.data

        const request = new SaladBowlMessages.LoginRequest()
        request.setJwt(jwt)
        const loginResponse = await this.client.login(request)

        if (loginResponse.getSuccess()) {
          this.isAuthenticated = true
        } else {
          this.isAuthenticated = false
        }
      }
    } catch (error) {
      this.isAuthenticated = false
      this.authenticationError = true
      console.log(error)
    } finally {
      this.authenticationPending = false
      this.authenticationError = false
    }
  }

  public logout = () => {
    const request = new SaladBowlMessages.LogoutRequest()
    this.client.logout(request)
    this.isAuthenticated = false
  }
}
