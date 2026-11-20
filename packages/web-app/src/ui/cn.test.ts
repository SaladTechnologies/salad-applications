import { describe, expect, it } from 'vitest'
import { cn } from './cn.ts'

describe('cn', () => {
  it('drops falsy values', () => {
    expect(cn('px-2', false, undefined, 'py-1')).toBe('px-2 py-1')
  })

  it('keeps the last of two conflicting classes', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('keeps a Salad font size next to a Salad color', () => {
    expect(cn('text-salad-small', 'text-salad-green')).toBe('text-salad-small text-salad-green')
  })

  it('keeps the last of two Salad font sizes', () => {
    expect(cn('text-salad-small', 'text-salad-large')).toBe('text-salad-large')
  })
})
