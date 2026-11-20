import type { AxiosAdapter } from 'axios'
import { AxiosError, AxiosHeaders, create } from 'axios'
import { describe, expect, it, vi } from 'vitest'
import type { BalanceStore } from '../balance'
import type { RewardStore } from '../reward'
import type { RewardVaultItem } from './models'
import { RewardVaultStatus } from './models'
import type { VaultState } from './VaultStore'
import { VaultStore } from './VaultStore'

/** A vault item as the App API sends it. */
const resource = (id: string, status: RewardVaultStatus) => ({
  id,
  name: `Reward ${id}`,
  price: 1,
  rewardId: `reward-${id}`,
  timestamp: '2026-11-01T00:00:00Z',
  code: ` code-${id} `,
  status,
})

/**
 * Creates the vault over a fake App API answering `answers` by path ('fail' fails a request), with a redemption under
 * way whose id is `currentRedemptionId`. The order of the requests and of the stores' calls goes into `calls`.
 */
const setUp = (answers: Record<string, unknown>, currentRedemptionId?: string) => {
  const calls: string[] = []
  const adapter: AxiosAdapter = async (config) => {
    calls.push(`GET ${String(config.url)}`)
    const data = answers[String(config.url)]
    const response = { data, status: 200, statusText: '', headers: new AxiosHeaders(), config }
    if (data === 'fail') {
      throw new AxiosError('Request failed', AxiosError.ERR_BAD_RESPONSE, config, undefined, {
        ...response,
        status: 500,
      })
    }
    return response
  }
  const balance = {
    refreshBalance: vi.fn(async () => {
      calls.push('balance')
    }),
  } as unknown as BalanceStore
  const clearRedemptionInfo = vi.fn()
  const rewards = { currentRedemptionId, clearRedemptionInfo } as unknown as RewardStore
  const vault = new VaultStore(create({ adapter }), balance, rewards)
  const states: VaultState[] = []
  vault.state.subscribe(() => states.push(vault.state.get()))
  return { vault, calls, states, clearRedemptionInfo }
}

describe('VaultStore', () => {
  it('loads the vault, and ends the redemption under way once it is in the vault', async () => {
    const answers = { '/api/v1/reward-vault': [resource('a', RewardVaultStatus.COMPLETE)] }
    const elsewhere = setUp(answers, 'b')
    const inVault = setUp(answers, 'a')

    await elsewhere.vault.loadVault()
    await inVault.vault.loadVault()

    expect(elsewhere.vault.state.get().redemptions).toStrictEqual([
      {
        id: 'a',
        name: 'Reward a',
        price: 1,
        rewardId: 'reward-a',
        timestamp: new Date('2026-11-01T00:00:00Z'),
        code: 'code-a',
        status: RewardVaultStatus.COMPLETE,
      },
    ])
    expect(elsewhere.clearRedemptionInfo).not.toHaveBeenCalled()
    expect(inVault.clearRedemptionInfo).toHaveBeenCalledTimes(1)
  })

  it('keeps the vault when a load fails', async () => {
    const answers: Record<string, unknown> = { '/api/v1/reward-vault': [resource('a', RewardVaultStatus.CREATED)] }
    const { vault } = setUp(answers)
    await vault.loadVault()
    answers['/api/v1/reward-vault'] = 'fail'

    await vault.loadVault()

    expect(vault.state.get().redemptions.map(({ id }) => id)).toStrictEqual(['a'])
  })

  it('adds a new redemption to the end of the vault', async () => {
    const { vault } = setUp({ '/api/v1/reward-vault': [resource('a', RewardVaultStatus.COMPLETE)] })
    await vault.loadVault()
    const added = { ...resource('b', RewardVaultStatus.CREATED), timestamp: new Date() } as RewardVaultItem

    vault.addRewardToRedemptionsList(added)

    expect(vault.state.get().redemptions.map(({ id }) => id)).toStrictEqual(['a', 'b'])
  })

  it('loads the four latest completed rewards with their images, newest first, then stops loading', async () => {
    const vaultItems = ['a', 'b', 'c', 'd', 'e'].map((id) => resource(id, RewardVaultStatus.COMPLETE))
    vaultItems.push(resource('f', RewardVaultStatus.FAILED))
    const answers: Record<string, unknown> = { '/api/v1/reward-vault': vaultItems }
    for (const id of ['b', 'c', 'd', 'e']) {
      answers[`/api/v1/rewards/reward-${id}`] = { coverImage: `/${id}.png` }
    }
    answers['/api/v1/rewards/reward-c'] = 'fail'
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const { vault, calls, states } = setUp(answers)
    await vault.loadVault()
    calls.length = 0
    states.length = 0

    await vault.loadLatestCompletedRedeemedRewards()

    expect(calls).toStrictEqual([
      'GET /api/v1/rewards/reward-e',
      'GET /api/v1/rewards/reward-d',
      'GET /api/v1/rewards/reward-c',
      'GET /api/v1/rewards/reward-b',
    ])
    expect(
      states.map((state) => [state.isLatestCompletedRedeemedRewardsLoading, state.latestCompletedRedeemedRewards.size]),
    ).toStrictEqual([
      [false, 0],
      [true, 0],
      [true, 1],
      [true, 2],
      [true, 3],
      [false, 3],
    ])
    expect([...vault.state.get().latestCompletedRedeemedRewards.keys()]).toStrictEqual(['e', 'd', 'b'])
    expect(vault.state.get().latestCompletedRedeemedRewards.get('e')).toMatchObject({ id: 'e', name: 'Reward e' })
  })

  it('refreshes the latest rewards from the vault it had, then the vault, then the balance', async () => {
    const { vault, calls } = setUp({
      '/api/v1/reward-vault': [resource('a', RewardVaultStatus.COMPLETE)],
      '/api/v1/rewards/reward-a': {},
    })

    await vault.refresh()
    await vault.refresh()

    expect(calls).toStrictEqual([
      'GET /api/v1/reward-vault',
      'balance',
      'GET /api/v1/rewards/reward-a',
      'GET /api/v1/reward-vault',
      'balance',
    ])
  })

  it('forgets the vault on sign-out', async () => {
    const { vault } = setUp({
      '/api/v1/reward-vault': [resource('a', RewardVaultStatus.COMPLETE)],
      '/api/v1/rewards/reward-a': {},
    })
    await vault.refresh()
    await vault.loadLatestCompletedRedeemedRewards()

    vault.resetUserData()

    expect(vault.state.get().redemptions).toStrictEqual([])
    expect(vault.state.get().latestCompletedRedeemedRewards.size).toBe(0)
  })
})
