import type { ReactElement } from 'react'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it } from 'vitest'
import { Button } from './button.tsx'

/** Renders the element into a new detached element and returns the class names of its first `selector` match. */
const classesOf = (element: ReactElement, selector: string): string[] | undefined => {
  // React only runs act() without warnings when the environment says it is a test.
  Reflect.set(globalThis, 'IS_REACT_ACT_ENVIRONMENT', true)
  const host = document.createElement('div')
  act(() => {
    createRoot(host).render(element)
  })
  return host.querySelector(selector)?.className.split(' ')
}

describe('button', () => {
  it('renders a button with the default variant and size', () => {
    const classes = classesOf(<Button>Redeem</Button>, 'button')

    expect(classes).toContain('bg-primary')
    expect(classes).toContain('h-9')
    expect(classes).not.toContain('bg-transparent')
  })

  it('keeps the resets for the browser button and link styles', () => {
    const classes = classesOf(<Button size="sm">Redeem</Button>, 'button')

    expect(classes).toStrictEqual(
      expect.arrayContaining([
        'font-[family-name:inherit]',
        'font-medium',
        'box-border',
        'no-underline',
        'p-0',
        'px-3',
      ]),
    )
  })

  it('lets a later class win over a variant class', () => {
    const classes = classesOf(
      <Button variant="outline" className="border-0">
        Cancel
      </Button>,
      'button',
    )

    expect(classes).toContain('border-0')
    expect(classes).not.toContain('border')
  })

  it('renders its child instead of a button with asChild', () => {
    const element = (
      <Button asChild variant="link">
        <a href="/store">Store</a>
      </Button>
    )

    expect(classesOf(element, 'button')).toBeUndefined()
    expect(classesOf(element, 'a')).toContain('text-primary')
    expect(classesOf(element, 'a')).not.toContain('bg-primary')
  })
})
