import { describe, expect, it, vi } from 'vitest'
import type { Mock } from 'vitest'
import type { AxiosInstance } from 'axios'
import type { RootStore } from '../../Store'
import { solanaWalletEndpointPath } from './constants'
import { SolanaWalletStore } from './SolanaWalletStore'

interface MockAxios {
  get: Mock
  post: Mock
  delete: Mock
}

const makeAxios = (overrides: Partial<MockAxios> = {}): AxiosInstance =>
  ({
    get: vi.fn().mockResolvedValue({ data: {} }),
    post: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn().mockResolvedValue({ data: {} }),
    ...overrides,
  }) as unknown as AxiosInstance

const makeRootStore = () =>
  ({
    notifications: { sendNotification: vi.fn() },
  }) as unknown as RootStore

const ADDRESS = '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1'
const NEW_ADDRESS = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU'

describe('SolanaWalletStore', () => {
  it('saves a wallet address and reflects success', async () => {
    const axios = makeAxios({ post: vi.fn().mockResolvedValue({ data: { walletAddress: ADDRESS } }) })
    const store = new SolanaWalletStore(makeRootStore(), axios)

    await store.setWallet(ADDRESS)

    expect(axios.post).toHaveBeenCalledWith(solanaWalletEndpointPath, { walletAddress: ADDRESS })
    expect(store.walletAddress).toBe(ADDRESS)
    expect(store.submitStatus).toBe('success')
    expect(store.hasWallet).toBe(true)
  })

  it('clears the wallet address on a successful delete', async () => {
    const store = new SolanaWalletStore(makeRootStore(), makeAxios())
    store.walletAddress = ADDRESS

    await store.clearWallet()

    expect(store.walletAddress).toBeUndefined()
    expect(store.submitStatus).toBe('success')
    expect(store.hasWallet).toBe(false)
  })

  // Regression: a Chef must be able to add a new wallet immediately after removing one, without a page reload.
  // A successful delete leaves `submitStatus === 'success'`; the subsequent save must NOT be short-circuited by
  // the in-flight ('loading') guard and must persist the new address.
  it('allows setting a new wallet address right after a successful delete', async () => {
    const post = vi.fn().mockResolvedValue({ data: { walletAddress: NEW_ADDRESS } })
    const store = new SolanaWalletStore(makeRootStore(), makeAxios({ post }))
    store.walletAddress = ADDRESS

    await store.clearWallet()
    expect(store.submitStatus).toBe('success')
    expect(store.walletAddress).toBeUndefined()

    await store.setWallet(NEW_ADDRESS)

    expect(post).toHaveBeenCalledWith(solanaWalletEndpointPath, { walletAddress: NEW_ADDRESS })
    expect(store.walletAddress).toBe(NEW_ADDRESS)
    expect(store.submitStatus).toBe('success')
  })

  it('flags a failure and notifies when saving the wallet fails', async () => {
    const rootStore = makeRootStore()
    const axios = makeAxios({ post: vi.fn().mockRejectedValue(new Error('boom')) })
    const store = new SolanaWalletStore(rootStore, axios)

    await store.setWallet(ADDRESS)

    expect(store.submitStatus).toBe('failure')
    expect(rootStore.notifications.sendNotification).toHaveBeenCalled()
  })
})
