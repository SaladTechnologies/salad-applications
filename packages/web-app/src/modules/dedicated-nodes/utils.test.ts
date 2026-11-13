import type { DedicatedNode } from './models'
import {
  filterNodesByEk,
  getRequestProblem,
  isEnrollmentExpired,
  mergeDedicatedNodes,
  parseEkFilter,
  shortenHexId,
} from './utils'

const node = (id: string, standing: DedicatedNode['standing'] = 'pending'): DedicatedNode => ({
  node_id: id,
  standing,
  ek_sha256: 'e'.repeat(64),
})

describe('getRequestProblem', () => {
  it('reads a SaladError-shaped error', () => {
    expect(getRequestProblem({ status: 409, title: 'Conflict' })).toEqual({ status: 409, title: 'Conflict' })
  })

  it('reads an Axios error response', () => {
    expect(getRequestProblem({ response: { status: 403, data: { detail: 'x' } } })).toEqual({
      status: 403,
      title: undefined,
    })
  })

  it('returns nothing for a non-object', () => {
    expect(getRequestProblem('boom')).toEqual({})
    expect(getRequestProblem(undefined)).toEqual({})
  })
})

describe('mergeDedicatedNodes', () => {
  it('appends new nodes and replaces repeated ones in place', () => {
    const merged = mergeDedicatedNodes([node('a'), node('b')], [node('b', 'approved'), node('c')])

    expect(merged.map((n) => [n.node_id, n.standing])).toEqual([
      ['a', 'pending'],
      ['b', 'approved'],
      ['c', 'pending'],
    ])
  })

  it('removes repeats within one page', () => {
    expect(mergeDedicatedNodes([], [node('a'), node('a', 'refused')])).toEqual([node('a', 'refused')])
  })
})

describe('shortenHexId', () => {
  it('keeps the start and end of a long id', () => {
    expect(shortenHexId('0123456789abcdef0123456789')).toBe('01234567…23456789')
  })

  it('leaves a short id alone', () => {
    expect(shortenHexId('abc')).toBe('abc')
  })
})

describe('isEnrollmentExpired', () => {
  const now = new Date('2026-11-13T00:00:00Z')

  it('is false without an expiry', () => {
    expect(isEnrollmentExpired(undefined, now)).toBe(false)
  })

  it('compares the expiry with now', () => {
    expect(isEnrollmentExpired('2026-11-12T23:59:59Z', now)).toBe(true)
    expect(isEnrollmentExpired('2026-11-13T00:00:01Z', now)).toBe(false)
  })

  it('is false for an unreadable expiry', () => {
    expect(isEnrollmentExpired('not a date', now)).toBe(false)
  })
})

describe('parseEkFilter', () => {
  const ek = 'ab'.repeat(32)

  it('reads the hash from the installer QR code text', () => {
    expect(parseEkFilter(`ek-sha256=${ek.toUpperCase()} serial=ABC123`)).toBe(ek)
  })

  it('reads a typed hash or prefix', () => {
    expect(parseEkFilter('  ABab12 ')).toBe('abab12')
  })

  it('returns nothing for text that is not hex', () => {
    expect(parseEkFilter('serial=XYZ')).toBe('')
    expect(parseEkFilter('')).toBe('')
  })
})

describe('filterNodesByEk', () => {
  const a = { ...node('a'), ek_sha256: 'aa11' + 'e'.repeat(60) }
  const b = { ...node('b'), ek_sha256: 'bb22' + 'e'.repeat(60) }

  it('keeps the nodes whose EK hash starts with the filter', () => {
    expect(filterNodesByEk([a, b], 'bb')).toEqual([b])
  })

  it('keeps every node without a filter', () => {
    expect(filterNodesByEk([a, b], '')).toEqual([a, b])
  })
})
