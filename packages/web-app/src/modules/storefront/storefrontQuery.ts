import type { AxiosInstance } from 'axios'
import { config } from '../../config'
import { fetchStorefront, storefrontQueryKey } from '../../rewards/storefront.ts'

/**
 * The storefront query, as the storefront store fetched it: once when the app starts (`src/index.tsx` prefetches it),
 * and again every `config.rewardRefreshRate` while the page shows or when the page shows after that long.
 */
export const storefrontQuery = (http: AxiosInstance) => ({
  queryKey: storefrontQueryKey,
  queryFn: async () => await fetchStorefront(http),
  staleTime: config.rewardRefreshRate,
  refetchInterval: config.rewardRefreshRate,
})
