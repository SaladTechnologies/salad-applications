import axios, { AxiosInstance } from 'axios'
import { Config } from './config'

export const createClient = (): AxiosInstance => {
  let c = axios.create({
    baseURL: Config.baseAPIUrl,
  })

  //   c.interceptors.request.use(req => {
  //     if (req.baseURL === '')
  //       return {
  //         headers: {},
  //         method: req.method,
  //         url: '',
  //       }
  //     return req
  //   })

  return c
}
