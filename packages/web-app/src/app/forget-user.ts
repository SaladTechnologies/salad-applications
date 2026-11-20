import type { QueryClient } from '@tanstack/react-query'
import { achievementsQueryKey } from '../account/achievements.ts'
import { xpQueryKey } from '../account/xp.ts'
import { demandAlertSubscriptionsQueryKey } from '../earnings/demand-monitor.ts'
import { machineEarningsHistoryQueryKey } from '../earnings/machine-earnings.ts'

/** A store that holds data of the signed-in user. */
interface UserDataStore {
  /** Forgets that data. */
  resetUserData: () => void
}

/**
 * Forgets the data of a user who signed out, so a different user who signs in later in the same tab never sees it: each
 * store's copy; the achievements', demand alert subscriptions' and XP's queries, which hold them; and the earnings
 * histories' query, whose freshness would otherwise skip the next user's load for up to an hour. Public data (the
 * storefront, the reward catalog) and the session stay.
 */
export const forgetSignedOutUser = (stores: readonly UserDataStore[], queryClient: QueryClient): void => {
  for (const store of stores) {
    store.resetUserData()
  }
  // Removes the histories' query without loading it now, so the next earnings page that opens loads the new user's. A
  // load still running when the user signed out settles on the removed query, so its freshness cannot skip that load.
  queryClient.removeQueries({ queryKey: machineEarningsHistoryQueryKey })
  // The achievements live in their query, kept for the session: removing it is how they are forgotten.
  queryClient.removeQueries({ queryKey: achievementsQueryKey })
  // So do the demand alert subscriptions and the XP.
  queryClient.removeQueries({ queryKey: demandAlertSubscriptionsQueryKey })
  queryClient.removeQueries({ queryKey: xpQueryKey })
}
