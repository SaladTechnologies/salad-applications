import type { QueryClient } from '@tanstack/react-query'
import { achievementsQueryKey } from '../account/achievements.ts'
import { earningRateBonusQueryKey, unclaimedBonusesQueryKey } from '../account/bonuses.ts'
import { profileQueryKey } from '../account/profile.ts'
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
 * store's copy; the profile's, achievements', demand alert subscriptions', XP's, referrals' and bonuses' queries, which
 * hold them; and the earnings histories' query, whose freshness would otherwise skip the next user's load for up to an
 * hour. Public data (the storefront, the reward catalog) and the session stay.
 */
export const forgetSignedOutUser = (stores: readonly UserDataStore[], queryClient: QueryClient): void => {
  for (const store of stores) {
    store.resetUserData()
  }
  // Resetting a query cancels the query's own load still running and empties it, and tells every component still showing
  // it, so none keeps the old user's data (the settings menu's referrals link, for one); removing it would leave them
  // showing it. A store's own request still running (the profile's load, say) is not cancelled: it can still write back
  // until the next user's load replaces it, as before. It loads nothing now: the pages that load these (histories,
  // achievements, subscriptions) load the new user's when they open, sign-in loads the profile, and sign-in and the
  // app-wide refresh load the XP, referral and bonus data.
  for (const queryKey of [
    profileQueryKey,
    machineEarningsHistoryQueryKey,
    achievementsQueryKey,
    demandAlertSubscriptionsQueryKey,
    xpQueryKey,
    referralsReportQueryKey,
    referralCodeQueryKey,
    currentReferralQueryKey,
    unclaimedBonusesQueryKey,
    earningRateBonusQueryKey,
  ]) {
    queryClient.getQueryCache().find({ queryKey })?.reset()
  }
}
