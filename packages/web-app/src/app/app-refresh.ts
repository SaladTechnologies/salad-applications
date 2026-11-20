import { useQuery } from '@tanstack/react-query'

/** The query key of the app-wide refresh. */
const appRefreshQueryKey = ['app', 'refresh'] as const

/**
 * Runs `refresh` once when the app opens, then every `interval` milliseconds for as long as the app is open, in a
 * background tab too, as the refresh service's `setInterval` did. The data stays in the stores; the query only
 * schedules the refresh. Sign-in runs `refresh` itself, outside this schedule, as before. The query's state is never
 * read, so a refresh never re-renders the app, as the timer never did.
 */
export const useAppRefresh = (refresh: () => void, interval: number): void => {
  useQuery({
    queryKey: appRefreshQueryKey,
    queryFn: () => {
      refresh()
      return null
    },
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    refetchInterval: interval,
    refetchIntervalInBackground: true,
    notifyOnChangeProps: [],
  })
}
