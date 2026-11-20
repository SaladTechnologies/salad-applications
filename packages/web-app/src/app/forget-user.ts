import type { QueryClient } from '@tanstack/react-query'
import { achievementsQueryKey } from '../account/achievements.ts'
import { currentReferralQueryKey, referralCodeQueryKey, referralsReportQueryKey } from '../account/referrals.ts'
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
 * store's copy; the achievements', demand alert subscriptions', XP's and referrals' queries, which hold them; and the
 * earnings histories' query, whose freshness would otherwise skip the next user's load for up to an hour. Public data
 * (the storefront, the reward catalog) and the session stay.
 */
export const forgetSignedOutUser = (stores: readonly UserDataStore[], queryClient: QueryClient): void => {
  for (const store of stores) {
    store.resetUserData()
  }
  // Resetting a query cancels a load still running and empties it, and tells every component still showing it, so none
  // keeps the old user's data (the settings menu's referrals link, for one); removing it would leave them showing it. It
  // loads nothing now: the pages that load these (histories, achievements, subscriptions) load the new user's when they
  // open, and sign-in and the app-wide refresh load the XP and referral data.
  for (const queryKey of [
    machineEarningsHistoryQueryKey,
    achievementsQueryKey,
    demandAlertSubscriptionsQueryKey,
    xpQueryKey,
    referralsReportQueryKey,
    referralCodeQueryKey,
    currentReferralQueryKey,
  ]) {
    queryClient.getQueryCache().find({ queryKey })?.reset()
  }
}
