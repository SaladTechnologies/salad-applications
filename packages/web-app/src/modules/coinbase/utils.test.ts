import { coinbaseEmailRequiredTag } from './constants'
import { rewardRequiresCoinbaseEmail } from './utils'

describe('rewardRequiresCoinbaseEmail', () => {
  it('is true for a reward with the Coinbase email tag', () => {
    expect(rewardRequiresCoinbaseEmail({ tags: ['render', coinbaseEmailRequiredTag] })).toBe(true)
  })

  it('matches the tag case-insensitively', () => {
    expect(rewardRequiresCoinbaseEmail({ tags: ['REQUIRES-COINBASE-EMAIL'] })).toBe(true)
  })

  it('is false for a reward without the tag', () => {
    expect(rewardRequiresCoinbaseEmail({ tags: ['render', 'requires-solana-address'] })).toBe(false)
    expect(rewardRequiresCoinbaseEmail({ tags: [] })).toBe(false)
    expect(rewardRequiresCoinbaseEmail({})).toBe(false)
    expect(rewardRequiresCoinbaseEmail(undefined)).toBe(false)
  })
})
