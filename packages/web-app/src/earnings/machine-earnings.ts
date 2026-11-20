import { useQuery } from '@tanstack/react-query'

/** The query key of the machines' 30-day earning histories, which the earnings pages chart. */
const machineEarningsHistoryQueryKey = ['earnings', 'machine-history'] as const

/** The query key of the current hourly earning rates of the machines on the shown page of the machine list. */
const machineEarningRatesQueryKey = (machineIds: readonly string[]) =>
  ['earnings', 'machine-rates', machineIds] as const

/** How long the machines' earning histories stay fresh: an hour, as the balance store throttled them. */
const machineEarningsHistoryStaleTime = 60 * 60 * 1000

/** How often the current earning rates refresh while an earnings page is open: every minute. */
const machineEarningRatesRefreshRate = 60 * 1000

/**
 * Runs `load` (the balance store's load of the machines and their 30-day earning histories) when an earnings page
 * opens, at most once an hour, as the store's throttle did. The histories stay in the store, which the charts read; the
 * query only schedules the load. `load` handles its own errors, so a failed load also waits an hour, as before.
 */
export const useMachineEarningsHistory = (load: () => Promise<unknown>): void => {
  useQuery({
    queryKey: machineEarningsHistoryQueryKey,
    queryFn: async () => {
      await load()
      return null
    },
    staleTime: machineEarningsHistoryStaleTime,
    gcTime: Number.POSITIVE_INFINITY,
  })
}

/**
 * Runs `load` (the balance store's load of the current hourly earning rates) for the machines on the shown page of the
 * machine list: when the page opens or the shown machines change, and every minute while it is open, in a background
 * tab too, as the page's timer did. The rates stay in the store, which the machine list reads.
 */
export const useMachineEarningRates = (
  machineIds: readonly string[],
  load: (machineIds: string[]) => Promise<unknown>,
): void => {
  useQuery({
    queryKey: machineEarningRatesQueryKey(machineIds),
    queryFn: async () => {
      await load([...machineIds])
      return null
    },
    staleTime: 0,
    refetchInterval: machineEarningRatesRefreshRate,
    refetchIntervalInBackground: true,
  })
}
