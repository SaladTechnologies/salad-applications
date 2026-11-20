import type { QueryClient } from '@tanstack/react-query'
import { skipToken, useQuery } from '@tanstack/react-query'
import type { AxiosInstance } from 'axios'

/** The query key of the signed-in user's lifetime XP (minutes chopped). Sign-out resets it. */
export const xpQueryKey = ['account', 'xp'] as const

/** Returns a function that fetches the signed-in user's lifetime XP. */
const xpFetcher = (http: AxiosInstance) => async (): Promise<number> => {
  const response = await http.get<{ lifetimeXp?: unknown }>('/api/v1/profile/xp')
  const xp = response.data.lifetimeXp
  if (typeof xp !== 'number') {
    throw new TypeError('The App API returned no lifetime XP.')
  }
  return xp
}

/**
 * Loads the signed-in user's lifetime XP now, and keeps it for the session. The app-wide refresh runs this while signed
 * in, as it ran the XP store's load. A failed load keeps the last XP, as the store did.
 */
export const loadXp = async (queryClient: QueryClient, http: AxiosInstance): Promise<void> => {
  try {
    await queryClient.query({
      queryKey: xpQueryKey,
      queryFn: xpFetcher(http),
      staleTime: 0,
      gcTime: Number.POSITIVE_INFINITY,
    })
  } catch {
    // The last XP stays, as the store kept it.
  }
}

/** Returns the signed-in user's lifetime XP, or 0 before it has loaded, as the XP store started at 0. */
export const currentXp = (queryClient: QueryClient): number => queryClient.getQueryData<number>(xpQueryKey) ?? 0

/** Returns the signed-in user's lifetime XP, or 0 before it has loaded. It never loads it: `loadXp` does. */
export const useXp = (): number =>
  useQuery<number>({ queryKey: xpQueryKey, queryFn: skipToken, gcTime: Number.POSITIVE_INFINITY }).data ?? 0
