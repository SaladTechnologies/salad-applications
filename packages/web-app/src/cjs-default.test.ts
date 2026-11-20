import { describe, expect, it } from 'vitest'
import { cjsDefault } from './cjs-default.ts'

const component = (): null => null

describe('cjsDefault', () => {
  it('unwraps a CommonJS module object compiled from ES modules', () => {
    const moduleExports = { __esModule: true, default: component, other: 1 }

    expect(cjsDefault<unknown>(moduleExports)).toBe(component)
  })

  it('returns a default export that is already unwrapped', () => {
    expect(cjsDefault(component)).toBe(component)
  })

  it('returns an object without __esModule unchanged', () => {
    const moduleExports = { default: 1 }

    expect(cjsDefault(moduleExports)).toBe(moduleExports)
  })
})
