import { useQuery } from '@tanstack/react-query'
import type { AxiosInstance } from 'axios'

/** The query key of the reward vault's refresh, which keeps the vault (and the balance shown beside it) current. */
const vaultRefreshQueryKey = ['reward-vault', 'refresh'] as const

/** How often the vault refreshes while a page that shows it is open: every 2 minutes. */
const vaultRefreshInterval = 2 * 60 * 1000

/** Fetches the reward vault (the user's redemptions) from the App API, as the API returned it. */
export const fetchVault = async (http: AxiosInstance): Promise<unknown> => {
  const response = await http.get<unknown>('/api/v1/reward-vault')
  return response.data
}

/**
 * Runs `refresh` (the vault store's refresh of the vault, its latest completed rewards, and the balance) when the page
 * opens, and every 2 minutes while it is open, in a background tab too, as the store's timer did. The data stays in the
 * stores, which redemption also reads and writes; the query only schedules the refresh.
 */
export const useVaultRefresh = (refresh: () => Promise<unknown>): void => {
  useQuery({
    queryKey: vaultRefreshQueryKey,
    queryFn: async () => {
      await refresh()
      return null
    },
    staleTime: 0,
    refetchInterval: vaultRefreshInterval,
    refetchIntervalInBackground: true,
  })
}
