import type { QueryClient } from '@tanstack/react-query'
import { skipToken, useQuery } from '@tanstack/react-query'
import type { AxiosInstance } from 'axios'

/** The notification banner the store shows while it is current. */
export interface BannerInfo {
  /** When it starts to show. */
  startDate: string
  /** When it stops showing. */
  endDate: string
  /** What it says. */
  text: string
}

/** The query key of the notification banner. It is public, so sign-out keeps it. */
const bannerQueryKey = ['app', 'banner'] as const

/**
 * Returns a function that fetches the notification banner, or `null` when there is none or the request failed (a failed
 * load hides it).
 */
const bannerFetcher = (http: AxiosInstance) => async (): Promise<BannerInfo | null> => {
  try {
    const response = await http.get<BannerInfo | null>('/api/v1/notification-banner')
    return response.data ?? null
  } catch {
    return null
  }
}

/**
 * Loads the notification banner now, and keeps it for the session. The app-wide refresh runs this (when the app opens,
 * every refresh, on sign-in, and after a claimed bonus), signed in or not, as it ran the home store's load.
 */
export const loadBanner = async (queryClient: QueryClient, http: AxiosInstance): Promise<void> => {
  await queryClient.query({
    queryKey: bannerQueryKey,
    queryFn: bannerFetcher(http),
    staleTime: 0,
    gcTime: Number.POSITIVE_INFINITY,
    // A new object on each load, even when unchanged, re-renders the banner, which checks its date window against the
    // clock as it renders, as the store's new object on each refresh did.
    structuralSharing: false,
  })
}

/** Returns the notification banner, or `undefined` while there is none. It never loads it: `loadBanner` does. */
export const useBanner = (): BannerInfo | undefined =>
  useQuery<BannerInfo | null>({ queryKey: bannerQueryKey, queryFn: skipToken, gcTime: Number.POSITIVE_INFINITY })
    .data ?? undefined
