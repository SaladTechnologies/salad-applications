import type { QueryClient } from '@tanstack/react-query'
import { machineEarningsHistoryQueryKey } from '../earnings/machine-earnings.ts'

/** A store that holds data of the signed-in user. */
interface UserDataStore {
  /** Forgets that data. */
  resetUserData: () => void
}

/**
 * Forgets the data of a user who signed out, so a different user who signs in later in the same tab never sees it: each
 * store's copy, and the earnings histories' freshness, which would otherwise skip the next user's load for up to an
 * hour. Public data (the storefront, the reward catalog) and the session stay.
 */
export const forgetSignedOutUser = (stores: readonly UserDataStore[], queryClient: QueryClient): void => {
  for (const store of stores) {
    store.resetUserData()
  }
  // Marks the histories stale without loading them now: the next earnings page that opens loads the new user's.
  for (const query of queryClient.getQueryCache().findAll({ queryKey: machineEarningsHistoryQueryKey })) {
    query.invalidate()
  }
}
