import { useQuery } from '@tanstack/react-query'
import type { AxiosInstance } from 'axios'
import type { ReactElement, ReactNode } from 'react'
import { useEffect } from 'react'
import { SessionContext, sessionFetcher, sessionQueryKey } from './session.ts'

/** The props of {@link SessionProvider}. */
export interface SessionProviderProps {
  /** The App API client. */
  http: AxiosInstance
  /** Called when the session becomes known, and each time it changes after that. */
  onChange: (session: 'yes' | 'no') => void
  /** The app. */
  children: ReactNode
}

/** Asks the App API once whether the user is signed in, and gives the answer to `useSession` and `onChange`. */
export const SessionProvider = ({ http, onChange, children }: SessionProviderProps): ReactElement => {
  const { data } = useQuery({
    queryKey: sessionQueryKey,
    queryFn: sessionFetcher(http),
    // Asked once. After that, only setSession changes it: a sign-in, a sign-out, or a 401 from the App API.
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  })
  const session = data ?? 'unknown'

  useEffect(() => {
    if (session !== 'unknown') {
      onChange(session)
    }
  }, [session, onChange])

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
}
