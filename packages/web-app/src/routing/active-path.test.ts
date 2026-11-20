import { describe, expect, it } from 'vitest'
import { isActivePath } from './active-path.ts'

describe('isActivePath', () => {
  it('is active on the path and below it, ignoring case and a trailing slash', () => {
    const results = [
      isActivePath('/account/summary', '/account/summary'),
      isActivePath('/account/summary/', '/account/summary'),
      isActivePath('/Account/Summary', '/account/summary'),
      isActivePath('/account/summary/x', '/account/summary/'),
    ]

    expect(results).toStrictEqual([true, true, true, true])
  })

  it('is not active on another path, even one that starts with the same letters', () => {
    const results = [
      isActivePath('/account/bonuses', '/account/summary'),
      isActivePath('/account/summary-old', '/account/summary'),
    ]

    expect(results).toStrictEqual([false, false])
  })
})
