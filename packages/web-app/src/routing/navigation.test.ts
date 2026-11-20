import { createMemoryHistory } from '@tanstack/react-router'
import { describe, expect, it } from 'vitest'
import { createNavigation } from './navigation.ts'

describe('createNavigation', () => {
  it('pushes a path with its query string, hash, and state', () => {
    const history = createMemoryHistory({ initialEntries: ['/store'] })
    const navigation = createNavigation(history)

    navigation.push('/account/backup-codes?x=1#codes', { isFirstPasskeyAdded: true })

    expect(navigation.location).toMatchObject({
      pathname: '/account/backup-codes',
      search: '?x=1',
      hash: '#codes',
      state: { isFirstPasskeyAdded: true },
    })
    expect(history).toHaveLength(2)
  })

  it('drops a push to the path and query string of the last navigation, whatever its hash', () => {
    const history = createMemoryHistory({ initialEntries: ['/store'] })
    const navigation = createNavigation(history)
    const { push } = navigation

    push('/account/summary')
    push('/account/summary')
    push('/account/summary#solana-wallet')

    expect(history).toHaveLength(2)
    expect(navigation.location.hash).toBe('')
  })

  it('lets the first push go to the page the app started on', () => {
    const history = createMemoryHistory({ initialEntries: ['/store'] })
    const navigation = createNavigation(history)

    navigation.push('/store')

    expect(history).toHaveLength(2)
  })

  it('pushes again after going somewhere else', () => {
    const history = createMemoryHistory({ initialEntries: ['/store'] })
    const navigation = createNavigation(history)

    navigation.push('/store/vault')
    navigation.replace('/store')
    navigation.push('/store/vault')

    expect(history).toHaveLength(3)
  })

  it('replaces the entry and goes back', () => {
    const history = createMemoryHistory({ initialEntries: ['/store'] })
    const navigation = createNavigation(history)
    const { goBack, push, replace } = navigation

    push('/rewards/1')
    replace('/store/rewards/1')
    goBack()

    expect(navigation.location.pathname).toBe('/store')
    expect(history).toHaveLength(2)
  })

  it('goes back when the app has an entry to go back to', () => {
    const history = createMemoryHistory({ initialEntries: ['/store'] })
    const navigation = createNavigation(history)

    navigation.push('/account/summary')
    navigation.goBackOr('/somewhere-else')

    expect(navigation.location.pathname).toBe('/store')
  })

  it('replaces the page with the fallback when it is the first page the app loaded', () => {
    const history = createMemoryHistory({ initialEntries: ['/account/summary'] })
    const navigation = createNavigation(history)

    navigation.goBackOr('/store')

    expect(navigation.location.pathname).toBe('/store')
    expect(history).toHaveLength(1)
  })
})
