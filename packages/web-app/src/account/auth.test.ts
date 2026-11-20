import type { AxiosAdapter } from 'axios'
import { AxiosError, AxiosHeaders, create } from 'axios'
import { describe, expect, it, vi } from 'vitest'
import type { Navigation } from '../routing/navigation.ts'
import type { Auth } from './auth.ts'
import { createAuth } from './auth.ts'

/**
 * Creates sign-in and sign-out over a fake App API that answers with `status`, on the page at `pathname`, recording
 * each request, session change, navigation and URL opened, in order.
 */
const setUp = (status: number, pathname: string): { auth: Auth; events: string[] } => {
  const events: string[] = []
  // oxlint-disable-next-line eslint/require-await, typescript/require-await -- an adapter returns a promise; this one answers at once
  const adapter: AxiosAdapter = async (config) => {
    events.push(`${config.method ?? ''} ${config.url ?? ''}`)
    const response = { data: {}, status, statusText: '', headers: new AxiosHeaders(), config }
    if (status !== 200) {
      throw new AxiosError('Request failed', AxiosError.ERR_BAD_RESPONSE, config, undefined, response)
    }
    return response
  }
  const navigation: Navigation = {
    location: { pathname, search: '', hash: '', state: undefined },
    push: () => {
      events.push('push')
    },
    replace: (path) => {
      events.push(`replace ${path}`)
    },
    goBack: () => {
      events.push('goBack')
    },
    goBackOr: () => {
      events.push('goBackOr')
    },
  }
  const auth = createAuth({
    http: create({ adapter }),
    setSession: (session) => {
      events.push(`session ${session}`)
    },
    navigation,
    loginUrl: 'https://login.example.com/login',
    assign: (url) => {
      events.push(`assign ${url}`)
    },
  })
  return { auth, events }
}

describe('auth', () => {
  it('does not know whether the user is signed in until it is told', () => {
    const { auth } = setUp(200, '/store')
    const seen = [auth.isAuthenticated()]

    auth.setIsAuthenticated(true)
    seen.push(auth.isAuthenticated())
    auth.setIsAuthenticated(false)
    seen.push(auth.isAuthenticated())

    expect(seen).toStrictEqual([undefined, true, false])
  })

  it('signs the user in when the session cookie is still good', async () => {
    expect.hasAssertions()
    const { auth, events } = setUp(200, '/store')

    await auth.login()

    expect(events).toStrictEqual(['get /api/v1/profile', 'session yes'])
  })

  it('sends a signed-out user to the login page, which returns them to the current page', async () => {
    expect.hasAssertions()
    const { auth, events } = setUp(401, '/store/rewards/abc')

    await auth.login()

    expect(events).toStrictEqual([
      'get /api/v1/profile',
      'assign https://login.example.com/login?redirect_uri=store/rewards/abc',
    ])
  })

  it('sends a signed-out user to the login page, which returns them to the page asked for', async () => {
    expect.hasAssertions()
    const { auth, events } = setUp(401, '/demand-monitor')

    await auth.login('/account/alerts')

    expect(events).toStrictEqual([
      'get /api/v1/profile',
      'assign https://login.example.com/login?redirect_uri=/account/alerts',
    ])
  })

  it('signs the user out, then leaves the onboarding pages for the store', async () => {
    expect.hasAssertions()
    const { auth, events } = setUp(200, '/onboarding/welcome')

    await auth.logout()

    expect(events).toStrictEqual(['post /api/v2/authentication-sessions/logout', 'session no', 'replace /store'])
  })

  it('signs the user out even when the App API call fails, and stays on any other page', async () => {
    expect.hasAssertions()
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {
      // A failed sign-out is logged; this keeps the log quiet.
    })
    const { auth, events } = setUp(500, '/store')

    await auth.logout()
    const errorsLogged = consoleError.mock.calls.length
    consoleError.mockRestore()

    expect(events).toStrictEqual(['post /api/v2/authentication-sessions/logout', 'session no'])
    expect(errorsLogged).toBe(1)
  })
})
