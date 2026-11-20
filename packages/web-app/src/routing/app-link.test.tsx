import { createMemoryHistory, createRootRoute, createRouter, RouterProvider } from '@tanstack/react-router'
import type { ReactElement } from 'react'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it, vi } from 'vitest'
import { AppLink } from './app-link.tsx'
import { createNavigation } from './navigation.ts'
import { NavigationContext } from './navigation-context.ts'
import { Redirect } from './redirect.tsx'

/** Renders the element as the only page of a router at the path, and returns the host and the navigation. */
const renderAt = async (
  path: string,
  element: ReactElement,
): Promise<{ host: HTMLDivElement; navigation: ReturnType<typeof createNavigation> }> => {
  // React only runs act() without warnings when the environment says it is a test.
  Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
  const history = createMemoryHistory({ initialEntries: [path] })
  const navigation = createNavigation(history)
  const rootRoute = createRootRoute({
    component: () => <NavigationContext.Provider value={navigation}>{element}</NavigationContext.Provider>,
  })
  const router = createRouter({ routeTree: rootRoute, history })
  const host = document.createElement('div')
  document.body.append(host)
  await act(async () => {
    await router.load()
    createRoot(host).render(<RouterProvider router={router} />)
  })
  return { host, navigation }
}

/** Clicks the element with the options, and returns whether the click's default action was prevented. */
const click = (element: Element | null, options: MouseEventInit = {}): boolean => {
  const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0, ...options })
  act(() => {
    element?.dispatchEvent(event)
  })
  return event.defaultPrevented
}

describe('app link', () => {
  it('goes to its path without reloading on a plain click', async () => {
    expect.hasAssertions()
    const { host, navigation } = await renderAt('/store', <AppLink to="/store/vault">Vault</AppLink>)

    const prevented = click(host.querySelector('a'))

    expect({ prevented, pathname: navigation.location.pathname }).toStrictEqual({
      prevented: true,
      pathname: '/store/vault',
    })
  })

  it('leaves a modified click to the browser, but still calls onClick', async () => {
    expect.hasAssertions()
    const onClick = vi.fn<() => void>()
    const { host, navigation } = await renderAt(
      '/store',
      <AppLink to="/store/vault" onClick={onClick}>
        Vault
      </AppLink>,
    )

    const prevented = click(host.querySelector('a'), { ctrlKey: true })

    expect({ prevented, pathname: navigation.location.pathname }).toStrictEqual({
      prevented: false,
      pathname: '/store',
    })
    expect(onClick).toHaveBeenCalledExactlyOnceWith()
  })

  it('adds the active class on its path and below it', async () => {
    expect.hasAssertions()
    const { host } = await renderAt(
      '/account/summary',
      <>
        <AppLink to="/account/summary" className="item" activeClassName="active">
          Account
        </AppLink>
        <AppLink to="/account/bonuses" className="item" activeClassName="active">
          Bonuses
        </AppLink>
      </>,
    )

    const links = [...host.querySelectorAll('a')]

    expect(links.map((link) => link.className)).toStrictEqual(['item active', 'item'])
    expect(links.map((link) => link.getAttribute('aria-current'))).toStrictEqual(['page', null])
  })
})

describe('redirect', () => {
  it('replaces the current entry with its path', async () => {
    expect.hasAssertions()
    const { navigation } = await renderAt('/rewards/1', <Redirect to="/store/rewards/1?x=1#y" />)

    expect(navigation.location).toMatchObject({ pathname: '/store/rewards/1', search: '?x=1', hash: '#y' })
  })
})
