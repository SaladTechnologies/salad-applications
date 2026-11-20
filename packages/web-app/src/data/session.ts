import type { QueryClient } from '@tanstack/react-query'
import type { AxiosInstance } from 'axios'
import { createContext, useContext } from 'react'

/** Whether the user is signed in: `unknown` until the App API answers. */
export type Session = 'unknown' | 'yes' | 'no'

/** The query key of the session. */
export const sessionQueryKey = ['session'] as const

/**
 * Returns a function that asks the App API whether the session cookie belongs to a signed-in user. Any failure means
 * no.
 */
export const sessionFetcher = (http: AxiosInstance) => async (): Promise<'yes' | 'no'> => {
  try {
    await http.get('/api/v1/profile')
    return 'yes'
  } catch {
    return 'no'
  }
}

/** Records that the user signed in (`yes`) or out (`no`, also on a 401 from the App API), without asking the API. */
export const setSession = (queryClient: QueryClient, session: 'yes' | 'no'): void => {
  queryClient.setQueryData(sessionQueryKey, session)
}

/** The session, for {@link useSession}. SessionProvider provides it. */
export const SessionContext = createContext<Session>('unknown')

/** Returns whether the user is signed in. */
export const useSession = (): Session => useContext(SessionContext)

/** Returns whether the user is signed in, `undefined` until it is known. */
export const isSignedIn = (session: Session): boolean | undefined =>
  session === 'unknown' ? undefined : session === 'yes'
