import { useQuery } from '@tanstack/react-query'

/** The query key of the demand monitor's GPUs and their demand, which the demand monitor and demand alerts pages show. */
const demandedHardwareQueryKey = ['earnings', 'demand-monitor', 'gpus'] as const

/** The query key of the account's demand alert subscriptions, which the demand alerts page lists. */
const demandAlertSubscriptionsQueryKey = ['earnings', 'demand-alerts', 'subscriptions'] as const

/** How often the demand monitor refreshes while it is open: every hour. */
const demandMonitorRefreshRate = 60 * 60 * 1000

/**
 * Runs `load` (the demand monitor store's load of the GPUs and their demand) when the demand monitor opens, and every
 * hour while it is open, in a background tab too, as the page's timer did. The GPUs stay in the store, which the page
 * reads; the query only schedules the load. `load` handles its own errors, so a failed load waits for the next hour.
 */
export const useDemandMonitorRefresh = (load: () => Promise<unknown>): void => {
  useQuery({
    queryKey: demandedHardwareQueryKey,
    queryFn: async () => {
      await load()
      return null
    },
    staleTime: 0,
    refetchInterval: demandMonitorRefreshRate,
    refetchIntervalInBackground: true,
  })
}

/**
 * Runs `loadGpus` (the demand monitor store's load of the GPUs) and `loadSubscriptions` (the demand alerts store's load
 * of the account's subscriptions) once each time the demand alerts page opens, as its sections did. The data stays in
 * the stores, which the sections read.
 */
export const useDemandAlertsLoads = (
  loadGpus: () => Promise<unknown>,
  loadSubscriptions: () => Promise<unknown>,
): void => {
  useQuery({
    queryKey: demandedHardwareQueryKey,
    queryFn: async () => {
      await loadGpus()
      return null
    },
    staleTime: 0,
  })
  useQuery({
    queryKey: demandAlertSubscriptionsQueryKey,
    queryFn: async () => {
      await loadSubscriptions()
      return null
    },
    staleTime: 0,
  })
}
