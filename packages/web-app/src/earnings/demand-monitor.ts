import type { QueryClient } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import type { AxiosInstance } from 'axios'

/** How much demand a GPU has. */
export type DemandTier = 'low' | 'mid' | 'high'

/** A GPU and its demand, as the demand monitor shows it. */
export interface DemandedHardwarePerformance {
  /** The GPU's id. */
  name: string
  /** The GPU's name to show. */
  displayName: string
  /** How much demand it has. */
  demandTier: DemandTier
  /** That demand's name to show. */
  demandTierName: 'Low' | 'Moderate' | 'High'
  /** What it earns, per hour. */
  earningRates: {
    /** The average. */
    avgEarningRate: number
    /** The average of the top quarter. */
    top25PctEarningRate: number
    /** The most. */
    maxEarningRate: number
    /** The least. */
    minEarningRate: number
  }
  /** What a machine with it should have. */
  recommendedSpecs: {
    /** Memory, in GB. */
    ramGb: number
  }
  /** How much of it is in use, in percent. */
  utilizationPct: number
  /** The names of the GPUs it covers. */
  variantNames: string[]
}

/** A demand alert the account subscribed to. */
export interface DemandedSubscription {
  /** When it was created. */
  createdAt: string
  /** The GPU's name to show. */
  gpuDisplayName: string
  /** The GPU's id. */
  gpuName: string
  /** The subscription's id. */
  id: string
  /** The demand it alerts on. */
  demandTier: DemandTier
}

/** The App API path of the GPUs and their demand. */
const gpusPath = '/api/v2/demand-monitor/gpu'

/** The App API path of the account's demand alert subscriptions. */
const subscriptionsPath = '/api/v2/demand-monitor/subscriptions'

/** The query key of the GPUs and their demand, which the demand monitor and demand alerts pages show. */
const demandedHardwareQueryKey = ['earnings', 'demand-monitor', 'gpus'] as const

/** The query key of the account's demand alert subscriptions, which the demand alerts page lists. Sign-out removes it. */
export const demandAlertSubscriptionsQueryKey = ['earnings', 'demand-alerts', 'subscriptions'] as const

/** How often the demand monitor refreshes while it is open: every hour. */
const demandMonitorRefreshRate = 60 * 60 * 1000

/** No subscriptions, until they first load. */
const noSubscriptions: readonly DemandedSubscription[] = []

/** Returns a function that fetches the GPUs and their demand. */
const gpusFetcher = (http: AxiosInstance) => async (): Promise<DemandedHardwarePerformance[]> => {
  const response = await http.get<DemandedHardwarePerformance[]>(gpusPath)
  return response.data
}

/** Returns a function that fetches the account's demand alert subscriptions. */
const subscriptionsFetcher = (http: AxiosInstance) => async (): Promise<DemandedSubscription[]> => {
  const response = await http.get<DemandedSubscription[]>(subscriptionsPath)
  return response.data
}

/**
 * Returns the GPUs and their demand for the demand monitor, or `undefined` until they first load. They load when the
 * page opens and every hour while it is open, in a background tab too, and are kept for the session: a failed load
 * keeps the last ones, as the demand monitor store did.
 */
export const useDemandMonitorGpus = (http: AxiosInstance): DemandedHardwarePerformance[] | undefined =>
  useQuery({
    queryKey: demandedHardwareQueryKey,
    queryFn: gpusFetcher(http),
    staleTime: 0,
    gcTime: Number.POSITIVE_INFINITY,
    refetchInterval: demandMonitorRefreshRate,
    refetchIntervalInBackground: true,
  }).data

/** The demand alerts page's data. */
export interface DemandAlertsData {
  /** The GPUs to set an alert for, or `undefined` until they first load. */
  gpus: DemandedHardwarePerformance[] | undefined
  /** The account's subscriptions; none until they first load. */
  subscriptions: readonly DemandedSubscription[]
}

/**
 * Returns the demand alerts page's data. Both load once each time the page opens, with no timer, and are kept for the
 * session: a failed load keeps the last ones, as the stores did.
 */
export const useDemandAlertsData = (http: AxiosInstance): DemandAlertsData => {
  const gpus = useQuery({
    queryKey: demandedHardwareQueryKey,
    queryFn: gpusFetcher(http),
    staleTime: 0,
    gcTime: Number.POSITIVE_INFINITY,
  }).data
  const subscriptions = useQuery({
    queryKey: demandAlertSubscriptionsQueryKey,
    queryFn: subscriptionsFetcher(http),
    staleTime: 0,
    gcTime: Number.POSITIVE_INFINITY,
  }).data
  return { gpus, subscriptions: subscriptions ?? noSubscriptions }
}

/** Subscribes the account to a demand alert for the GPU at the demand. Rejects with the App API's error. */
export const subscribeToDemandAlert = async (
  http: AxiosInstance,
  gpuName: string,
  demandTier: DemandTier,
): Promise<void> => {
  await http.post(subscriptionsPath, { gpuName, demandTier })
}

/** Removes the account's demand alert subscription. Rejects with the App API's error. */
export const unsubscribeFromDemandAlert = async (http: AxiosInstance, subscriptionId: string): Promise<void> => {
  await http.delete(`${subscriptionsPath}/${subscriptionId}`)
}

/** Loads the account's subscriptions again, now, for the demand alerts page that shows them. */
export const reloadDemandAlertSubscriptions = async (queryClient: QueryClient): Promise<void> => {
  await queryClient.invalidateQueries({ queryKey: demandAlertSubscriptionsQueryKey })
}
