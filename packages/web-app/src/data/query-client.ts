import { QueryClient } from '@tanstack/react-query'

/**
 * Creates the app's query client. Its defaults are set on purpose rather than left to TanStack Query's:
 *
 * - No refetch when the window regains focus or the network reconnects. Pages refresh on their own schedule, and a
 *   refetch must never repeat a request the user did not ask for (a price quote, a redemption's status).
 * - No retry. The HTTP client already retries safe requests that failed on the network or the server, and nothing else is
 *   safe to repeat.
 */
export const createQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })
