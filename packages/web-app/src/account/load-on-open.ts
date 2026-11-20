import { useQuery } from '@tanstack/react-query'

/** Runs `load` each time a page that calls it opens. The data stays in the store; the query only schedules the load. */
export const useLoadOnOpen = (queryKey: readonly string[], load: () => Promise<unknown>): void => {
  useQuery({
    queryKey,
    queryFn: async () => {
      await load()
      return null
    },
    staleTime: 0,
  })
}
