import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios'
import axios from 'axios'
import axiosRetry, { exponentialDelay } from 'axios-retry'
import isRetryAllowed from 'is-retry-allowed'
import SuperTokens from 'supertokens-website'
import { config } from './config'
import { getStore } from './Store'

/**
 * The list of safe HTTP request methods. HTTP requests using these methods may be retried.
 */
const SAFE_HTTP_METHODS: ReadonlyArray<string> = ['get', 'head', 'options']

/**
 * Determines whether a HTTP request may be retried. HTTP requests may be retried on network errors. HTTP requests using
 * safe methods (GET, HEAD, and OPTIONS) may be retried after a HTTP response with status codes 408 or 500-599.
 * @param error The error.
 * @returns `true` if the HTTP request may be retried; otherwise, `false`.
 */
const shouldRetryDownload = (error: any): boolean => {
  if (error.isAxiosError === true) {
    const axiosError: AxiosError<any> = error
    return (
      SAFE_HTTP_METHODS.indexOf(axiosError.config?.method?.toLowerCase() || '') !== -1 &&
      (axiosError.response == null ||
        axiosError.response.status === 408 ||
        (axiosError.response.status >= 500 && axiosError.response.status <= 599))
    )
  }
  return isRetryAllowed(error)
}

export const createClient = (): AxiosInstance => {
  let httpClient = axios.create({
    baseURL: config.apiBaseUrl,
  })

  SuperTokens.addAxiosInterceptors(httpClient)
  httpClient.interceptors.response.use(
    (response) => {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      console.log('Response Interceptor: ', response)
      return response
    },
    (error) => {
      try {
        if (error.response.status === 401 && error.config.baseURL === config.apiBaseUrl) {
          SuperTokens.doesSessionExist().then((result) => {
            if (!result) {
              console.log('Response Interceptor: SuperToken session - doesn`t exist')
              const store = getStore()
              store.auth.setIsAuthenticated(false)
            }
          })
        }
      } finally {
        throw onError(error)
      }
    },
  )
  httpClient.defaults.timeout = 10000

  axiosRetry(httpClient, {
    retryDelay: exponentialDelay,
    retryCondition: shouldRetryDownload,
    shouldResetTimeout: true,
  })
  return httpClient
}

const getMessage = (type: string): string => {
  //These values are directly from the server located in ErrorTypes.cs

  if (!type) return 'Unknown Error'

  switch (type) {
    //General
    case 'general:unknown':
      return 'Unknown Error'

    //Reward redemption
    case 'redemptions:insufficientBalance':
      return `Must construct additional pylons ...just kidding! You balance isn't enough to redeem this reward, try again after you’ve earned some more`
    case 'redemptions:disabled':
      return `Redemptions are currently disabled, please try again later.`

    //Rewards
    case 'rewards:notFound':
      return 'Reward not found'
    case 'rewards:outOfStock':
      return 'This reward has run out. Check back later!'

    //Users
    case 'users:notFound':
      return 'User not found'

    default:
      return 'Unknown error'
  }
}

export class SaladError extends Error {
  // You have to extend Error, set the __proto__ to Error, and use
  // Object.setPrototypeOf in order to have a proper custom error type in JS.
  // Because JS/TS are dumb sometimes, and all three are needed to make this
  // work in all browsers.
  __proto__ = Error

  constructor(
    public readonly status: number,
    public readonly type: string,
    public readonly title?: string,
    public readonly detail?: string,
    public readonly response?: AxiosResponse,
  ) {
    super('')
    this.message = getMessage(type)
    this.status = status

    // See https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, SaladError.prototype)
  }
}

const onError = (error: any): Error | undefined => {
  if (!error.response || !error.response.data) return error

  let data = error.response.data

  if (!data.type || !data.status) return error

  let e = new SaladError(data.status, data.type, data.title, data.detail, error.response)

  return e
}
