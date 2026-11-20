import { useQuery } from '@tanstack/react-query'

/** The query key of the account's achievements, which the achievements page shows. */
const achievementsQueryKey = ['account', 'achievements'] as const

/**
 * Runs `load` (the achievements store's load of the account's achievements) each time the achievements page opens, as
 * the page did. The achievements stay in the store, which the page reads; the query only schedules the load. `load`
 * handles its own errors.
 */
export const useAchievementsLoad = (load: () => Promise<unknown>): void => {
  useQuery({
    queryKey: achievementsQueryKey,
    queryFn: async () => {
      await load()
      return null
    },
    staleTime: 0,
  })
}
