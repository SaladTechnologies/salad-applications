import type { ReactElement } from 'react'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it } from 'vitest'
import { Button } from './button.tsx'

/** Renders the element into a new detached container and returns the container. */
const render = (element: ReactElement): HTMLDivElement => {
  // React only runs act() without warnings when the environment says it is a test.
  Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
  const container = document.createElement('div')
  act(() => {
    createRoot(container).render(element)
  })
  return container
}

describe('button', () => {
  it('renders a button with the default variant and size', () => {
    const button = render(<Button>Redeem</Button>).querySelector('button')

    expect(button?.textContent).toBe('Redeem')
    expect(button?.className).toContain('bg-primary')
    expect(button?.className).toContain('h-9')
  })

  it('lets a later class win over a variant class', () => {
    const classes = render(
      <Button variant="outline" className="border-0">
        Cancel
      </Button>,
    )
      .querySelector('button')
      ?.className.split(' ')

    expect(classes).toContain('border-0')
    expect(classes).not.toContain('border')
  })

  it('renders its child instead of a button with asChild', () => {
    const container = render(
      <Button asChild variant="link">
        <a href="/store">Store</a>
      </Button>,
    )

    expect(container.querySelector('button')).toBeNull()
    expect(container.querySelector('a')?.className).toContain('text-primary')
  })
})
