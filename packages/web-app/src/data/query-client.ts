import { QueryClient } from '@tanstack/react-query'

/**
 * Creates the app's query client. Its defaults are set on purpose rather than left to TanStack Query's:
 *
 * - No refetch when the window regains focus or the network reconnects. Pages refresh on their own schedule, and a
 *   refetch must never repeat a request the user did not ask for (a price quote, a redemption's status).
 * - No retry. The HTTP client already retries safe requests that failed on the network or the server, and nothing else is
 *   safe to repeat.
 * - Requests are always sent, as the stores sent them, even after the browser reports it is offline: the request fails
 *   and the HTTP client handles it. TanStack Query would otherwise hold the request and send it when the browser is
 *   back online, by then possibly on another page, where a load's side effects (a navigation, a sudo prompt) must not
 *   run.
 */
export const createQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        networkMode: 'always',
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
      },
      mutations: {
        networkMode: 'always',
        retry: false,
      },
    },
  })
