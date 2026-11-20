import type { QueryClient } from '@tanstack/react-query'
import { skipToken, useQuery } from '@tanstack/react-query'
import type { AxiosInstance } from 'axios'
import { isAxiosError } from 'axios'

/** The terms of a referral. */
interface ReferralDefinition {
  /** The balance the referee earns to complete the referral. */
  balanceThreshold: number
  /** The rate of the referee's bonus. */
  bonusRate: number
  /** The referrer's bonus. */
  referrerBonus: number
  /** The balance at which the referrer earns the bonus. */
  referrerBonusThreshold: number
}

/** A referral: a user who signed up with a referral code. */
export interface Referral {
  /** The referred user's id. */
  refereeId: string
  /** The referring user's id. */
  referrerId?: string
  /** The referral code used. */
  code: string
  /** The balance the referred user earned. */
  earnedBalance: number
  /** The referral's terms. */
  referralDefinition?: ReferralDefinition
  /** The balance the referrer earned from it. */
  referrerEarnedBalance: number
}

/** The signed-in user's referrals so far. */
export interface ReferralsReport {
  /** The latest referrals. */
  latestReferrals: Referral[]
  /** What the referrals could still earn. */
  potentialEarnings: number
  /** How many referrals there are. */
  referralsCount: number
  /** What the referrals earned. */
  totalEarned: number
  /** When the report was made. */
  updatedAt: string
}

/** The signed-in user's referral code, and whether referrals are enabled for them. */
export interface ReferralCode {
  /** The code, or `''` before it has loaded. */
  code: string
  /** Whether referrals are enabled for the user, or `false` before the code has loaded. */
  enabled: boolean
}

/** The query key of the signed-in user's referrals report. Sign-out resets it. */
export const referralsReportQueryKey = ['account', 'referrals', 'report'] as const
/** The query key of the signed-in user's referral code, which says whether referrals are enabled. Sign-out resets it. */
export const referralCodeQueryKey = ['account', 'referrals', 'code'] as const
/** The query key of the referral the signed-in user signed up with. Sign-out resets it. */
export const currentReferralQueryKey = ['account', 'referrals', 'current'] as const

/** The referral code before it has loaded, as the referral store started. */
const noReferralCode: ReferralCode = { code: '', enabled: false }

/**
 * Loads a query now and keeps it for the session. A load already running is cancelled first, so each load sends its own
 * request, as the referral store's did. A failed load keeps the last data, as the store did.
 */
const load = async <Data>(
  queryClient: QueryClient,
  queryKey: readonly string[],
  queryFn: () => Promise<Data>,
): Promise<void> => {
  try {
    await queryClient.cancelQueries({ queryKey, exact: true })
    await queryClient.query({ queryKey, queryFn, staleTime: 0, gcTime: Number.POSITIVE_INFINITY })
  } catch {
    // The last data stays, as the store kept it.
  }
}

/** Loads the signed-in user's referrals report. The app-wide refresh runs this while signed in. */
export const loadReferralsReport = async (queryClient: QueryClient, http: AxiosInstance): Promise<void> => {
  await load(queryClient, referralsReportQueryKey, async () => {
    const response = await http.get<ReferralsReport>('/api/v2/referrals/report')
    return response.data
  })
}

/** Loads the signed-in user's referral code, and whether referrals are enabled for them. Sign-in runs this. */
export const loadReferralCode = async (queryClient: QueryClient, http: AxiosInstance): Promise<void> => {
  await load(queryClient, referralCodeQueryKey, async (): Promise<ReferralCode> => {
    const response = await http.get<{ code: string; userReferralsEnabled: boolean }>('/api/v1/profile/referral-code')
    return { code: response.data.code, enabled: response.data.userReferralsEnabled }
  })
}

/**
 * Loads the referral the signed-in user signed up with: `null` when the App API has none for them (a 404). Sign-in runs
 * this.
 */
export const loadCurrentReferral = async (queryClient: QueryClient, http: AxiosInstance): Promise<void> => {
  await load(queryClient, currentReferralQueryKey, async (): Promise<Referral | null> => {
    try {
      const response = await http.get<Referral>('/api/v1/profile/referral')
      return response.data
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        return null
      }
      throw error
    }
  })
}

/** Returns the signed-in user's referrals report, or `undefined` before it has loaded. It never loads it. */
export const useReferralsReport = (): ReferralsReport | undefined =>
  useQuery<ReferralsReport>({ queryKey: referralsReportQueryKey, queryFn: skipToken, gcTime: Number.POSITIVE_INFINITY })
    .data

/** Returns the signed-in user's referral code, and whether referrals are enabled for them. It never loads them. */
export const useReferralCode = (): ReferralCode =>
  useQuery<ReferralCode>({ queryKey: referralCodeQueryKey, queryFn: skipToken, gcTime: Number.POSITIVE_INFINITY })
    .data ?? noReferralCode

/**
 * Returns the referral the signed-in user signed up with, or `undefined` when there is none or it hasn't loaded. It
 * never loads it.
 */
export const useCurrentReferral = (): Referral | undefined =>
  useQuery<Referral | null>({ queryKey: currentReferralQueryKey, queryFn: skipToken, gcTime: Number.POSITIVE_INFINITY })
    .data ?? undefined
