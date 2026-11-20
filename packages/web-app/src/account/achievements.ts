import { useQuery } from '@tanstack/react-query'
import type { AxiosInstance } from 'axios'

/** An achievement of the account, as the achievements page shows it. */
export interface Achievement {
  /** The badge image's URL. */
  badgeImageUrl: string
  /** When the account completed it, or `null` if it has not. */
  completedAt: string | null
  /** What the account does to complete it. */
  description: string
  /** The achievement's id. */
  id: string
  /** The achievement's name. */
  name: string
}

/** The query key of the account's achievements, which the achievements page shows. Sign-out resets it. */
export const achievementsQueryKey = ['account', 'achievements'] as const

/**
 * Returns a function that fetches the account's achievements. The App API gives each badge's path; `apiBaseUrl` makes
 * it a URL.
 */
export const achievementsFetcher = (http: AxiosInstance, apiBaseUrl: string) => async (): Promise<Achievement[]> => {
  const response = await http.get<Achievement[]>('/api/v2/achievements')
  return response.data.map(({ badgeImageUrl, completedAt, description, id, name }) => ({
    badgeImageUrl: `${apiBaseUrl}${badgeImageUrl}`,
    completedAt,
    description,
    id,
    name,
  }))
}

/**
 * Returns the account's achievements, or `undefined` until they first load. They load each time the achievements page
 * opens, and are kept for the session, so a page opened again shows the last ones while it loads, and a failed load
 * keeps them, as the achievements store did.
 */
export const useAchievements = (http: AxiosInstance, apiBaseUrl: string): Achievement[] | undefined =>
  useQuery({
    queryKey: achievementsQueryKey,
    queryFn: achievementsFetcher(http, apiBaseUrl),
    staleTime: 0,
    gcTime: Number.POSITIVE_INFINITY,
  }).data
