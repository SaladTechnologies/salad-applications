import axios, { AxiosInstance } from 'axios'
import { Config } from './config'

export const createClient = (): AxiosInstance => {
  let c = axios.create({
    baseURL: Config.baseAPIUrl,
  })

  return c
}
