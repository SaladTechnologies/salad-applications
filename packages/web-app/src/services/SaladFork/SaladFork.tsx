import { SaladBowlMessages, SaladBowlServices } from '@saladtechnologies/salad-grpc-salad-bowl'
import {
  MinerStatRequest,
  MinerStatResponse,
  WorkloadStatus,
  WorkloadStatusRequest,
} from '@saladtechnologies/salad-grpc-salad-bowl/salad/grpc/salad_bowl/v1/salad_bowl_pb'
import type { AxiosInstance } from 'axios'
import { Observable, Observer, Subscription } from 'rxjs'
import type { GuiStateData, SaladBowlLoginResponse } from './models/SaladBowlLoginResponse'
import { SaladBowlLoginResponseError } from './models/SaladBowlLoginResponse'
import { SaladBowlLogoutResponse, SaladBowlLogoutResponseError } from './models/SaladBowlLogoutResponse'

export interface SaladForkInterface {
  login: () => Promise<SaladBowlLoginResponse>
  logout: () => Promise<SaladBowlLogoutResponse>
  minerStats$: () => Observable<MinerStatResponse>
  setPreferences: (preferences: Record<string, boolean>) => Promise<void>
  start: () => Promise<void>
  stop: () => Promise<void>
  workloadStatuses$: () => Observable<WorkloadStatus>
}

export class SaladFork implements SaladForkInterface {
  readonly client: SaladBowlServices.SaladBowlServicePromiseClient

  constructor(private readonly axios: AxiosInstance) {
    const server: string = 'http://127.0.0.1:5000'
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
          const userPreferenceRequest = new SaladBowlMessages.GetUserPreferenceRequest()
          const guiStateRequest = new SaladBowlMessages.GetGUIStateRequest()

          const [userPreferencesResult, guiStateResult] = await Promise.allSettled([
            this.client.getUserPreferences(userPreferenceRequest),
            this.client.getGUIState(guiStateRequest),
          ])

          let userPreferences: Record<string, boolean> = {}

          if (userPreferencesResult.status === 'fulfilled') {
            const preferences = userPreferencesResult.value.getPreferences()
            if (preferences) {
              const preferencesMap = preferences.getPreferencesMap()
              if (preferencesMap) {
                userPreferences = Object.fromEntries(preferencesMap.entries())
              }
            }
          } else {
            throw new Error(SaladBowlLoginResponseError.failedToGetUserPreferences)
          }

          let guiStateData: GuiStateData = {}

          if (guiStateResult.status === 'fulfilled') {
            const guiState = guiStateResult.value.getState()

            guiStateData.isChopping = guiState?.hasChoptime()

            const startTime = guiState?.getStart()
            if (startTime) {
              guiStateData.startTime = startTime.getSeconds()
            }
          } else {
            throw new Error(SaladBowlLoginResponseError.failedToGetGuiState)
          }

          return {
            preferences: userPreferences,
            runningState: guiStateData,
          }
        } else {
          throw new Error(SaladBowlLoginResponseError.unableToLoginToSaladBowl)
        }
      } else {
        throw new Error(SaladBowlLoginResponseError.unableToRetrieveJWT)
      }
    } catch (error) {
      throw new Error(SaladBowlLoginResponseError.unableToRetrieveJWT)
    }
  }

  public logout = async (): Promise<SaladBowlLogoutResponse> => {
    const request = new SaladBowlMessages.LogoutRequest()
    return await this.client
      .logout(request)
      .then(() => Promise.resolve())
      .catch(() => {
        throw new Error(SaladBowlLogoutResponseError.unableToLoginToSaladBowl)
      })
  }

  public start = async (): Promise<void> => {
    const startRequest = new SaladBowlMessages.StartRequest()
    await this.client.start(startRequest)
  }

  public stop = async (): Promise<void> => {
    const stopRequest = new SaladBowlMessages.StopRequest()
    await this.client.stop(stopRequest)
  }

  public minerStats$ = (): Observable<MinerStatResponse> => {
    return new Observable((observer: Observer<MinerStatResponse>) => {
      var minerReq = new MinerStatRequest()
      minerReq.setUpdateperiodsec(5)
      let stream = this.client.minerStats(minerReq, {})
      stream.on('data', (result) => observer.next(result as MinerStatResponse))
      stream.on('error', (err) => console.log(err))
      stream.on('end', () => {
        observer.complete()
      })
      return new Subscription(() => stream.cancel())
    })
  }

  public workloadStatuses$ = (topic: string = '*.>'): Observable<WorkloadStatus> => {
    let request = new WorkloadStatusRequest()
    request.setTopic(topic)

    return new Observable((observer: Observer<WorkloadStatus>) => {
      let stream = this.client.workloadStatuses(request, {})
      stream.on('data', (result) => observer.next(result as WorkloadStatus))
      stream.on('error', (err) => observer.error(err))
      stream.on('end', () => observer.complete())
      return new Subscription(() => stream.cancel())
    })
  }

  public setPreferences = async (preferences: Record<string, boolean>): Promise<void> => {
    const request = new SaladBowlMessages.SetUserPreferenceRequest()
    const userPreferences = new SaladBowlMessages.UserPreferences()

    for (const preference in preferences) {
      userPreferences.getPreferencesMap().set(preference, preferences[preference])
    }

    request.setPreferences(userPreferences)
    await this.client.setUserPreferences(request)
  }

  public getPreferences = async (): Promise<void> => {
    const request = new SaladBowlMessages.GetUserPreferenceRequest()
    await this.client.getUserPreferences(request)
  }
}
