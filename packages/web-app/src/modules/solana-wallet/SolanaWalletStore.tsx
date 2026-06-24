import type { AxiosInstance, AxiosResponse } from 'axios'
import { action, flow, observable } from 'mobx'
import type { RootStore } from '../../Store'
import { NotificationMessageCategory } from '../notifications/models'
import { solanaWalletEndpointPath } from './constants'
import type { SolanaWallet } from './models'

export type SolanaWalletSubmitStatus = 'unknown' | 'submitting' | 'success' | 'failure'

export class SolanaWalletStore {
  @observable
  public walletAddress?: string

  @observable
  public isWalletLoading: boolean = false

  @observable
  public isWalletLoadError: boolean = false

  @observable
  public submitStatus: SolanaWalletSubmitStatus = 'unknown'

  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {}

  @action.bound
  loadWallet = flow(function* (this: SolanaWalletStore) {
    this.isWalletLoading = true
    this.isWalletLoadError = false
    try {
      const response: AxiosResponse<SolanaWallet> = yield this.axios.get(solanaWalletEndpointPath)
      this.walletAddress = response.data?.walletAddress ?? undefined
    } catch (err) {
      this.isWalletLoadError = true
      this.walletAddress = undefined
    } finally {
      this.isWalletLoading = false
    }
  })

  @action.bound
  setWalletAddress = flow(function* (this: SolanaWalletStore, walletAddress: string) {
    if (this.submitStatus === 'submitting') {
      return
    }
    this.submitStatus = 'submitting'
    try {
      const response: AxiosResponse<SolanaWallet> = yield this.axios.post(solanaWalletEndpointPath, { walletAddress })
      this.walletAddress = response.data?.walletAddress ?? walletAddress
      this.submitStatus = 'success'
    } catch (err) {
      this.submitStatus = 'failure'
      this.store.notifications.sendNotification({
        category: NotificationMessageCategory.FurtherActionRequired,
        title: 'Unable to update your Solana wallet address',
        message: 'Please check the address and try again.',
        autoClose: false,
        type: 'error',
      })
    }
  })

  @action.bound
  clearWalletAddress = flow(function* (this: SolanaWalletStore) {
    if (this.submitStatus === 'submitting') {
      return
    }
    this.submitStatus = 'submitting'
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

  @action.bound
  resetSubmitStatus = () => {
    this.submitStatus = 'unknown'
  }
}
