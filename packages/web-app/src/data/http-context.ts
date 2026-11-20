import type { AxiosInstance } from 'axios'
import { createContext, useContext } from 'react'

/** The App API client, for query hooks. `src/index.tsx` provides it. */
export const HttpContext = createContext<AxiosInstance | undefined>(undefined)

/** Returns the App API client. Throws outside {@link HttpContext}. */
export const useHttp = (): AxiosInstance => {
  const http = useContext(HttpContext)
  if (http === undefined) {
    throw new Error('useHttp must be used inside HttpContext, which src/index.tsx provides.')
  }
  return http
}
