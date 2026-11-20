import { describe, expect, it, vi } from 'vitest'
import { onceWhen } from './once-when.ts'

describe('onceWhen', () => {
  it('runs the effect the first time the check finds the condition true, and never again', () => {
    const state = { ready: false }
    const effect = vi.fn<() => void>()
    const check = onceWhen(() => state.ready, effect)

    check()
    const beforeReady = effect.mock.calls.length
    state.ready = true
    check()
    check()
    state.ready = false
    state.ready = true
    check()

    expect(beforeReady).toBe(0)
    expect(effect).toHaveBeenCalledExactlyOnceWith()
  })
})
