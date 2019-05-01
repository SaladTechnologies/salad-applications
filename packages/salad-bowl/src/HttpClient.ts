import axios, { AxiosInstance } from 'axios'
import * as Config from './config'

export const createClient = (): AxiosInstance => {
  let c = axios.create({
    baseURL: Config.baseAPIUrl,
  })

  return c
}
