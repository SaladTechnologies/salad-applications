import axios, { AxiosInstance } from 'axios'
import { Config } from './config'

export const createClient = (): AxiosInstance => {
  let c = axios.create({
    baseURL: Config.baseAPIUrl,
  })

  c.interceptors.response.use(
    response => {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response
    },
    error => {
      let a = onError(error)
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      // return Promise.reject(a)
      throw a
    },
  )

  return c
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
  ) {
    super('')
    this.message = getMessage(type)

    // See https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, SaladError.prototype)
  }
}

const onError = (error: any): Error | undefined => {
  if (!error.response || !error.response.data) return error

  let data = error.response.data

  if (!data.type || !data.status) return error

  let e = new SaladError(data.status, data.type, data.title, data.detail)

  return e
}
