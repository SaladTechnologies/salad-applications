import type { AxiosInstance } from 'axios'

/** The query key of the storefront page (the CMS's blocks of heroes, reward lists, and content). */
export const storefrontQueryKey = ['storefront'] as const

/** Fetches the storefront page from the App API. Its shape is the CMS's; the storefront views read it. */
export const fetchStorefront = async (http: AxiosInstance): Promise<unknown> => {
  const response = await http.get<unknown>('/api/v2/storefront')
  return response.data
}

/** The options of the storefront query. */
interface StorefrontQuery {
  queryKey: typeof storefrontQueryKey
  queryFn: () => Promise<unknown>
  staleTime: number
  gcTime: number
  refetchInterval: number
}

/**
 * The storefront query, as the storefront store fetched it: once when the app starts (`src/index.tsx` prefetches it),
 * and again every `refreshRate` milliseconds while the page shows, or when the page shows after that long. It is kept
 * for the whole session, as the store kept it, so the page never shows its skeleton again.
 */
export const storefrontQuery = (http: AxiosInstance, refreshRate: number): StorefrontQuery => ({
  queryKey: storefrontQueryKey,
  queryFn: async () => {
    const storefront = await fetchStorefront(http)
    return storefront
  },
  staleTime: refreshRate,
  gcTime: Number.POSITIVE_INFINITY,
  refetchInterval: refreshRate,
})

/** The price and quantity the storefront shows for a reward. */
interface ShownReward {
  price: unknown
  quantity: unknown
}

/** The block types that hold rewards, and where in each block. */
const heroBlock = 'storefront.carousel-block'
const rewardBlock = 'storefront.reward-list-block'

/** Returns the entries of an array field of an object, or none. */
const entriesOf = (value: unknown, key: string): readonly unknown[] => {
  if (typeof value !== 'object' || value === null) {
    return []
  }
  const field: unknown = Reflect.get(value, key)
  return Array.isArray(field) ? field : []
}

/** Returns the reward a storefront item shows, with its id, or `undefined` for an item without one. */
const shownRewardOf = (item: unknown): [string, ShownReward] | undefined => {
  if (typeof item !== 'object' || item === null) {
    return undefined
  }
  const uuid: unknown = Reflect.get(item, 'uuid')
  if (typeof uuid !== 'string') {
    return undefined
  }
  return [uuid, { price: Reflect.get(item, 'price'), quantity: Reflect.get(item, 'quantity') }]
}

/** Returns the field of an object, or `undefined` for anything else. */
const fieldOf = (value: unknown, key: string): unknown =>
  typeof value === 'object' && value !== null ? (Reflect.get(value, key) as unknown) : undefined

/** Returns the reward items of a storefront block: a hero block's items' rewards, or a reward list's rewards. */
const rewardItemsOf = (block: unknown): readonly unknown[] => {
  const component = fieldOf(block, '__component')
  if (component === heroBlock) {
    return entriesOf(block, 'items').map((item) => fieldOf(item, 'reward'))
  }
  if (component === rewardBlock) {
    return entriesOf(block, 'rewards')
  }
  return []
}

/** Returns the rewards the storefront shows, by id: the hero items' rewards and the reward lists' rewards. */
const shownRewardsOf = (storefront: unknown): ReadonlyMap<string, ShownReward> => {
  const shown = new Map<string, ShownReward>()
  for (const block of entriesOf(storefront, 'blocks')) {
    for (const item of rewardItemsOf(block)) {
      const entry = shownRewardOf(item)
      if (entry !== undefined) {
        shown.set(...entry)
      }
    }
  }
  return shown
}

/** A reward as the App API returned it, for {@link isStorefrontOutdated}. */
export interface LoadedReward {
  /** The reward's id. */
  id: string
  /** The reward's price. */
  price: number
  /** How many are left, or `undefined` when it is not low. */
  quantity?: number | undefined
}

/**
 * Returns whether the storefront shows a different price or quantity for the reward than the App API just returned, so
 * the storefront should be fetched again. The CMS cannot store an undefined quantity, so it shows -1 for a reward that
 * is not low.
 */
export const isStorefrontOutdated = (storefront: unknown, reward: LoadedReward): boolean => {
  const shown = shownRewardsOf(storefront).get(reward.id)
  if (shown === undefined) {
    return false
  }
  return shown.price !== reward.price || shown.quantity !== (reward.quantity ?? -1)
}
