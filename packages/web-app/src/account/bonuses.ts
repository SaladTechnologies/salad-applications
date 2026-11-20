import type { QueryClient } from '@tanstack/react-query'
import { skipToken, useQuery } from '@tanstack/react-query'
import type { AxiosInstance } from 'axios'
import { DateTime } from 'luxon'
import { useSyncExternalStore } from 'react'

/** The kinds of bonus the App API gives, as `Bonus.blockType` names them. */
export const bonusTypes = {
  avatar: 'avatar',
  balance: 'balance',
  earningRate: 'earningRateMultiplier',
  reward: 'reward',
  xp: 'xp',
} as const

/** A kind of bonus (see {@link bonusTypes}). */
type BonusType = (typeof bonusTypes)[keyof typeof bonusTypes]

/** A bonus the signed-in user hasn't claimed yet. */
export interface Bonus {
  /** The bonus's id. */
  id: string
  /** The bonus's name. */
  name?: string | undefined
  /** Why the user got the bonus. */
  reason?: string | undefined
  /** The bonus's icon. */
  iconImageUrl?: string | undefined
  /** When the bonus expires. */
  expiresAt?: Date | undefined
  /** The kind of bonus. */
  blockType?: BonusType | undefined
}

/** The earning rate bonus that is active for the signed-in user. */
export interface BonusEarningRate {
  /** The bonus's id. */
  bonusId?: string | undefined
  /** What the user has earned with it. */
  earnedAmount?: number | undefined
  /** The most the user can earn with it. */
  earnedAmountLimit?: number | undefined
  /** The multiplier it applies to the earning rate. */
  multiplier?: number | undefined
}

/** The query key of the signed-in user's unclaimed bonuses, the first to expire first. Sign-out resets it. */
export const unclaimedBonusesQueryKey = ['account', 'bonuses', 'unclaimed'] as const

/** The query key of the signed-in user's active earning rate bonus. Sign-out resets it. */
export const earningRateBonusQueryKey = ['account', 'bonuses', 'earning-rate'] as const

/**
 * The active earning rate bonus as the App API answered it, or `undefined` after a failed load, as the bonus store held
 * it. It is wrapped because a query's data can't be `undefined`.
 */
interface EarningRateBonus {
  rate: BonusEarningRate | undefined
}

/** The bonus claims under way, which the bonus page and the navigation bar show. */
export interface BonusClaims {
  /** The ids of the bonuses being claimed; a bonus being claimed can't be claimed again until that ends. */
  pending: ReadonlySet<string>
  /** The earning rate bonus that waits, in the replace-bonus modal, to replace the active one. */
  replacementEarningRateBonusId: string | undefined
}

/** The signed-in user's bonuses: their loads, their claims, and the claims' state. */
export interface Bonuses {
  /**
   * Loads the active earning rate bonus and the unclaimed bonuses, starting in that order. The app-wide refresh runs
   * this while signed in. It never rejects.
   */
  load: () => Promise<void>
  /**
   * Claims a bonus. An earning rate bonus that would replace the active one opens the replace-bonus modal instead,
   * unless the modal confirmed it. Afterwards (or after that), the app-wide refresh runs and the claim ends.
   */
  claim: (bonusId: string) => Promise<void>
  /**
   * Claims the bonus waiting in the replace-bonus modal, replacing the active earning rate bonus, and forgets it as
   * waiting once the claim has started.
   */
  replaceCurrentEarningRate: () => Promise<void>
  /** Forgets the bonus waiting in the replace-bonus modal, which closed without replacing. */
  clearReplacementEarningRateBonusId: () => void
  /** Forgets the bonus waiting in the replace-bonus modal of the user who signed out. */
  resetUserData: () => void
  /** Returns the claims' state. A change makes a new state, so it can be compared by reference. */
  get: () => BonusClaims
  /** Calls `listener` after each change to the claims' state, and returns a function that stops that. */
  subscribe: (listener: () => void) => () => void
}

/** What {@link createBonuses} needs. */
export interface BonusesOptions {
  /** The app's query client, which holds the bonuses. */
  queryClient: QueryClient
  /** The App API client. */
  http: AxiosInstance
  /** Opens the replace-bonus modal. */
  openReplaceModal: () => void
  /** Tells the user the bonus is claimed. */
  onClaimed: (bonus: Bonus) => void
  /** Tells the user the claim failed. */
  onClaimFailed: () => void
  /** Runs the app-wide refresh, which reloads the bonuses with the rest of the user's data. */
  refreshData: () => void
}

/** Whether a bonus has a name to sort by. */
const hasName = (name: string | undefined): name is string => name !== undefined && name !== ''

/** The first bonus to expire first; bonuses without a date go by name. The bonus store sorted them so. */
const byExpiry = (a: Bonus, b: Bonus): number => {
  if (a.expiresAt && b.expiresAt) {
    return DateTime.fromJSDate(a.expiresAt).startOf('day') < DateTime.fromJSDate(b.expiresAt).startOf('day') ? -1 : 1
  }
  return hasName(a.name) && hasName(b.name) ? a.name.localeCompare(b.name) : 0
}

/**
 * Loads a query with a new request, and keeps it for the session. A failed load keeps the last data, as the bonus store
 * did. A load already running is cancelled first: reusing it, as a query otherwise would, could keep an answer from
 * before a claim (the claimed bonus, or no active earning rate, which would skip the replace modal next time).
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

/** Loads the signed-in user's active earning rate bonus. A failed load means none, as the bonus store held it. */
const loadEarningRateBonus = async (queryClient: QueryClient, http: AxiosInstance): Promise<void> => {
  await load(queryClient, earningRateBonusQueryKey, async (): Promise<EarningRateBonus> => {
    try {
      const response = await http.get<BonusEarningRate>('/api/v2/bonuses/earning-rate')
      return { rate: response.data }
    } catch {
      return { rate: undefined }
    }
  })
}

/** Loads the signed-in user's unclaimed bonuses, the first to expire first. A failed load keeps the last ones. */
const loadUnclaimedBonuses = async (queryClient: QueryClient, http: AxiosInstance): Promise<void> => {
  await load(queryClient, unclaimedBonusesQueryKey, async (): Promise<Bonus[]> => {
    const response = await http.get<Bonus[]>('/api/v2/bonuses')
    const bonuses = response.data
    // The App API sends each expiry as an ISO string, which becomes a date on the bonus just received, as the store did.
    for (const bonus of bonuses) {
      bonus.expiresAt = DateTime.fromISO(String(bonus.expiresAt)).toJSDate()
    }
    // Sorts the array just received in place (toSorted needs newer browsers than the build supports).
    // oxlint-disable-next-line unicorn/no-array-sort -- the array is the response's own; nothing else holds it
    return bonuses.sort(byExpiry)
  })
}

/** The bonus claims' state, which changes by replacing it, and the listeners told of each change. */
interface ClaimsStore {
  get: () => BonusClaims
  update: (change: Partial<BonusClaims>) => void
  subscribe: (listener: () => void) => () => void
}

/** Creates the claims' state with no claim under way, as the bonus store started. */
const createClaimsStore = (): ClaimsStore => {
  let claims: BonusClaims = { pending: new Set(), replacementEarningRateBonusId: undefined }
  const listeners = new Set<() => void>()
  return {
    get: () => claims,
    update: (change) => {
      claims = { ...claims, ...change }
      for (const listener of listeners) {
        listener()
      }
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

/** What a claim reads and changes. */
interface ClaimContext {
  options: BonusesOptions
  claims: ClaimsStore
  /** Whether the next claim replaces the active earning rate bonus; the replace-bonus modal's confirm sets it. */
  replacing: { next: boolean }
}

/** Returns the function that claims a bonus, as the bonus store's `claimBonus` did. */
const claimer =
  ({ options, claims, replacing }: ClaimContext) =>
  async (bonusId: string): Promise<void> => {
    const { queryClient, http } = options
    if (claims.get().pending.has(bonusId)) {
      return
    }
    try {
      const bonus = queryClient.getQueryData<Bonus[]>(unclaimedBonusesQueryKey)?.find((x) => x.id === bonusId)
      if (!bonus) {
        throw new Error('Bonus not found')
      }
      const activeEarningRate = queryClient.getQueryData<EarningRateBonus>(earningRateBonusQueryKey)?.rate
      // An earning rate bonus that would replace the active one waits for the replace-bonus modal's confirm.
      if (bonus.blockType === bonusTypes.earningRate && activeEarningRate !== undefined && !replacing.next) {
        claims.update({ replacementEarningRateBonusId: bonus.id })
        options.openReplaceModal()
        return
      }
      claims.update({ pending: new Set([...claims.get().pending, bonusId]) })
      await http.post(`/api/v2/bonuses/${bonusId}/claim`)
      options.onClaimed(bonus)
    } catch {
      options.onClaimFailed()
    } finally {
      options.refreshData()
      const pending = new Set(claims.get().pending)
      pending.delete(bonusId)
      claims.update({ pending })
      replacing.next = false
    }
  }

/** Creates the signed-in user's bonuses, with no claim under way, as the bonus store started. */
export const createBonuses = (options: BonusesOptions): Bonuses => {
  const { queryClient, http } = options
  const claims = createClaimsStore()
  const replacing = { next: false }
  const claim = claimer({ options, claims, replacing })
  return {
    load: async () => {
      // Started in this order, as the store started them.
      await Promise.all([loadEarningRateBonus(queryClient, http), loadUnclaimedBonuses(queryClient, http)])
    },
    claim,
    replaceCurrentEarningRate: async () => {
      const bonusId = claims.get().replacementEarningRateBonusId
      if (bonusId !== undefined) {
        replacing.next = true
        const claiming = claim(bonusId)
        // The modal closes now; a stale id would let forward reopen it with nothing to replace.
        claims.update({ replacementEarningRateBonusId: undefined })
        await claiming
      }
    },
    clearReplacementEarningRateBonusId: () => {
      claims.update({ replacementEarningRateBonusId: undefined })
    },
    resetUserData: () => {
      claims.update({ replacementEarningRateBonusId: undefined })
    },
    get: claims.get,
    subscribe: claims.subscribe,
  }
}

/** No bonuses, before they load: one array, so a reader re-renders only when they do. */
const noBonuses: readonly Bonus[] = []

/** Returns the bonus claims under way, and re-renders when they change. */
export const useBonusClaims = (bonuses: Bonuses): BonusClaims => useSyncExternalStore(bonuses.subscribe, bonuses.get)

/** Returns the signed-in user's unclaimed bonuses, the first to expire first, or none before they load. Never loads. */
export const useUnclaimedBonuses = (): readonly Bonus[] =>
  useQuery<Bonus[]>({ queryKey: unclaimedBonusesQueryKey, queryFn: skipToken, gcTime: Number.POSITIVE_INFINITY })
    .data ?? noBonuses

/** Returns the signed-in user's active earning rate bonus, or `undefined` when there is none. It never loads it. */
export const useEarningRateBonus = (): BonusEarningRate | undefined =>
  useQuery<EarningRateBonus>({
    queryKey: earningRateBonusQueryKey,
    queryFn: skipToken,
    gcTime: Number.POSITIVE_INFINITY,
  }).data?.rate
