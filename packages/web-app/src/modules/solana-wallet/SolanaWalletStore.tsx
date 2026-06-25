import type { AxiosInstance, AxiosResponse } from 'axios'
import { action, computed, flow, observable } from 'mobx'
import type { RootStore } from '../../Store'
import { NotificationMessageCategory } from '../notifications/models'
import { solanaWalletEndpointPath } from './constants'
import type { SolanaWallet } from './models'

export type SolanaWalletSubmitStatus = 'unknown' | 'loading' | 'success' | 'failure'

export class SolanaWalletStore {
  /** The Chef's currently saved Solana wallet address, if any. */
  @observable
  public walletAddress?: string

  /** Whether the initial `GET` of the wallet is in flight. */
  @observable
  public isLoading: boolean = false

  /** Whether the most recent load failed. */
  @observable
  public isLoadError: boolean = false

  /** Status of the most recent set/clear mutation. */
  @observable
  public submitStatus: SolanaWalletSubmitStatus = 'unknown'

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {}

  @computed
  public get hasWallet(): boolean {
    return !!this.walletAddress
  }

  @action.bound
  public setSubmitStatus = (submitStatus: SolanaWalletSubmitStatus) => {
    this.submitStatus = submitStatus
  }

  @action.bound
  public loadWallet = flow(function* (this: SolanaWalletStore) {
    this.isLoading = true
    this.isLoadError = false
    try {
      const response: AxiosResponse<SolanaWallet> = yield this.axios.get(solanaWalletEndpointPath)
      this.walletAddress = response.data?.walletAddress || undefined
    } catch (err) {
      this.isLoadError = true
      this.walletAddress = undefined
    } finally {
      this.isLoading = false
    }
  })

  @action.bound
  public setWallet = flow(function* (this: SolanaWalletStore, walletAddress: string) {
    if (this.submitStatus === 'loading') {
      return
    }
    this.submitStatus = 'loading'
    try {
      const response: AxiosResponse<SolanaWallet> = yield this.axios.post(solanaWalletEndpointPath, { walletAddress })
      this.walletAddress = response.data?.walletAddress ?? walletAddress
      this.submitStatus = 'success'
    } catch (err) {
      this.submitStatus = 'failure'
      this.store.notifications.sendNotification({
        category: NotificationMessageCategory.FurtherActionRequired,
        title: 'Unable to save your Solana wallet address',
        message: 'Please double check the address and try again.',
        autoClose: false,
        type: 'error',
      })
    }
  })

  @action.bound
  public clearWallet = flow(function* (this: SolanaWalletStore) {
    if (this.submitStatus === 'loading') {
      return
    }
    this.submitStatus = 'loading'
    try {
      yield this.axios.delete(solanaWalletEndpointPath)
      this.walletAddress = undefined
      this.submitStatus = 'success'
    } catch (err) {
      this.submitStatus = 'failure'
      this.store.notifications.sendNotification({
        category: NotificationMessageCategory.FurtherActionRequired,
        title: 'Unable to remove your Solana wallet address',
        message: 'Please try again.',
        autoClose: false,
        type: 'error',
      })
    }
  })
}
