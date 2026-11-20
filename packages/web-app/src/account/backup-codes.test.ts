import type { AxiosAdapter } from 'axios'
import { AxiosError, AxiosHeaders, create } from 'axios'
import type { Mock } from 'vitest'
import { describe, expect, it, vi } from 'vitest'
import type { BackupCodesState, BackupCodesStore } from './backup-codes.ts'
import { createBackupCodes } from './backup-codes.ts'

/** The backup codes under test, the requests they sent, and every state they went through. */
interface Setup {
  backupCodes: BackupCodesStore
  requests: string[]
  states: BackupCodesState[]
  onVerified: Mock<() => void>
}

const codes = { codes: ['a1', 'b2'], createdAt: '2026-11-20' }

/** Creates backup codes over a fake App API, which fails the requests in `failing` and answers the rest with `codes`. */
const setUp = (failing: readonly string[] = []): Setup => {
  const requests: string[] = []
  // oxlint-disable-next-line eslint/require-await, typescript/require-await -- an adapter returns a promise; this one answers at once
  const adapter: AxiosAdapter = async (config) => {
    const request = `${String(config.method).toUpperCase()} ${String(config.url)}`
    requests.push(request)
    const response = { data: codes, status: 200, statusText: '', headers: new AxiosHeaders(), config }
    if (failing.includes(request)) {
      throw new AxiosError('Request failed', AxiosError.ERR_BAD_RESPONSE, config, undefined, {
        ...response,
        status: 500,
      })
    }
    return response
  }
  const onVerified = vi.fn<() => void>()
  const backupCodes = createBackupCodes({ http: create({ adapter }), onVerified })
  const states: BackupCodesState[] = []
  backupCodes.subscribe(() => {
    states.push(backupCodes.get())
  })
  return { backupCodes, requests, states, onVerified }
}

describe('backup codes', () => {
  it('loads the codes, showing none while they load', async () => {
    expect.hasAssertions()
    const { backupCodes, requests, states } = setUp()

    await backupCodes.getBackupCodes()

    expect(requests).toStrictEqual(['GET /api/v2/backup-codes'])
    expect(states.map((state) => state.backupCodes)).toStrictEqual([undefined, codes])
  })

  it('makes new codes, showing none until they arrive', async () => {
    expect.hasAssertions()
    const { backupCodes, requests, states } = setUp()

    await backupCodes.generateBackupCodes()

    expect(requests).toStrictEqual(['POST /api/v2/backup-codes'])
    expect(states.map((state) => state.backupCodes)).toStrictEqual([undefined, codes])
  })

  it('shows none when the codes fail to load', async () => {
    expect.hasAssertions()
    const { backupCodes } = setUp(['GET /api/v2/backup-codes'])

    await backupCodes.getBackupCodes()

    expect(backupCodes.get().backupCodes).toBeUndefined()
  })

  it('verifies with a backup code and runs the waiting action, or shows that it failed', async () => {
    expect.hasAssertions()
    const verified = setUp()
    const failed = setUp(['POST /api/v2/backup-codes/verify'])

    await verified.backupCodes.verifyWithBackupCode('a1')
    await failed.backupCodes.verifyWithBackupCode('zz')

    expect(verified.requests).toStrictEqual(['POST /api/v2/backup-codes/verify'])
    expect(verified.onVerified).toHaveBeenCalledExactlyOnceWith()
    expect(verified.backupCodes.get()).toMatchObject({ hasVerifyWithBackupCodeFailed: false })
    expect(failed.onVerified).not.toHaveBeenCalled()
    expect(failed.backupCodes.get()).toMatchObject({ hasVerifyWithBackupCodeFailed: true })
  })

  it('forgets the codes on sign-out and tells the pages showing them', async () => {
    expect.hasAssertions()
    const { backupCodes, states } = setUp()
    await backupCodes.getBackupCodes()

    backupCodes.resetUserData()

    expect(backupCodes.get().backupCodes).toBeUndefined()
    expect(states).toHaveLength(3)
  })
})
