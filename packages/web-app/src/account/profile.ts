import type { QueryClient } from '@tanstack/react-query'
import { skipToken, useQuery } from '@tanstack/react-query'

/** The signed-in user's profile, as the App API returns it. */
export interface Profile {
  /** The user's id. */
  id: string
  /** The user's username. */
  username: string
  /** The user's email address. */
  email: string
  /** Extra details that some rewards need. */
  extensions?: {
    /** The user's Minecraft username, which Minecraft rewards need. */
    minecraftUsername?: string
  }
  /** The last app version whose "Salad was Updated" toast the user saw. */
  lastSeenApplicationVersion: string | undefined
  /** Whether redeeming a reward needs the user verified first (sudo mode). */
  redemptionTfaEnabled: boolean
  /** When the user first signed in to Salad on a machine, if ever. */
  saladBowlFirstLoginAt: string | undefined | null
  /** When the account was created. */
  createdAt: string | undefined
  /** The version of the terms the user has yet to accept, if any. */
  pendingTermsVersion: string | undefined
}

/** The query key of the signed-in user's profile. Sign-out resets it. */
export const profileQueryKey = ['account', 'profile'] as const

/**
 * Holds the signed-in user's profile, for the session. The profile store loads and saves it (its requests and their
 * order are the store's), and keeps it here, the one copy every reader shows.
 */
export const setProfile = (queryClient: QueryClient, profile: Profile): void => {
  // Kept for the session, as the store kept it, even while nothing shows it.
  queryClient.setQueryDefaults(profileQueryKey, { gcTime: Number.POSITIVE_INFINITY })
  queryClient.setQueryData(profileQueryKey, profile)
}

/** Forgets the profile (a failed load, or sign-out), and tells every component showing it. */
export const forgetProfile = (queryClient: QueryClient): void => {
  queryClient.getQueryCache().find({ queryKey: profileQueryKey })?.reset()
}

/** Returns the signed-in user's profile, or `undefined` before it has loaded. */
export const currentProfile = (queryClient: QueryClient): Profile | undefined =>
  queryClient.getQueryData<Profile>(profileQueryKey)

/** Returns the signed-in user's profile, or `undefined` before it has loaded. It never loads it: the profile store does. */
export const useProfile = (): Profile | undefined =>
  useQuery<Profile>({ queryKey: profileQueryKey, queryFn: skipToken, gcTime: Number.POSITIVE_INFINITY }).data
