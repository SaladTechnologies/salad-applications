import { describe, expect, it } from 'vitest'
import { isStorefrontOutdated } from './storefront.ts'

const storefront = {
  blocks: [
    {
      __component: 'storefront.carousel-block',
      items: [{ reward: { uuid: 'hero', price: 10, quantity: -1 } }, { reward: null }],
    },
    {
      __component: 'storefront.reward-list-block',
      rewards: [{ uuid: 'listed', price: 5, quantity: 3 }, null],
    },
    { __component: 'storefront.content-block', rewards: [{ uuid: 'ignored', price: 1, quantity: 1 }] },
  ],
}

describe('isStorefrontOutdated', () => {
  it('is false when the storefront shows the price and quantity the App API returned', () => {
    expect([
      isStorefrontOutdated(storefront, { id: 'hero', price: 10 }),
      isStorefrontOutdated(storefront, { id: 'listed', price: 5, quantity: 3 }),
    ]).toStrictEqual([false, false])
  })

  it('is true when the price or the quantity changed', () => {
    expect([
      isStorefrontOutdated(storefront, { id: 'hero', price: 12 }),
      isStorefrontOutdated(storefront, { id: 'listed', price: 5, quantity: 2 }),
      isStorefrontOutdated(storefront, { id: 'listed', price: 5 }),
    ]).toStrictEqual([true, true, true])
  })

  it('is false for a reward the storefront does not show, or no storefront yet', () => {
    expect([
      isStorefrontOutdated(storefront, { id: 'ignored', price: 99 }),
      isStorefrontOutdated(undefined, { id: 'hero', price: 99 }),
    ]).toStrictEqual([false, false])
  })
})
