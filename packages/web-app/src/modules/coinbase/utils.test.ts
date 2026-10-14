import { coinbaseEmailRequiredTag } from './constants'
import { rewardRequiresCoinbaseEmail } from './utils'

describe('rewardRequiresCoinbaseEmail', () => {
  it('is true for a reward with the Coinbase email tag when the feature is on', () => {
    expect(rewardRequiresCoinbaseEmail({ tags: ['render', coinbaseEmailRequiredTag] }, true)).toBe(true)
  })

  it('matches the tag case-insensitively', () => {
    expect(rewardRequiresCoinbaseEmail({ tags: ['REQUIRES-COINBASE-EMAIL'] }, true)).toBe(true)
  })

  it('is false for a reward without the tag', () => {
    expect(rewardRequiresCoinbaseEmail({ tags: ['render', 'requires-solana-address'] }, true)).toBe(false)
    expect(rewardRequiresCoinbaseEmail({ tags: [] }, true)).toBe(false)
    expect(rewardRequiresCoinbaseEmail({}, true)).toBe(false)
    expect(rewardRequiresCoinbaseEmail(undefined, true)).toBe(false)
  })

  it('is always false while the feature is off', () => {
    expect(rewardRequiresCoinbaseEmail({ tags: [coinbaseEmailRequiredTag] }, false)).toBe(false)
  })

  it('defaults to the shipped flag, which is off', () => {
    expect(rewardRequiresCoinbaseEmail({ tags: [coinbaseEmailRequiredTag] })).toBe(false)
  })
})
