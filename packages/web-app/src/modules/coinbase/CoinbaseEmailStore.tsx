import type { AxiosInstance, AxiosResponse } from 'axios'
import Axios from 'axios'
import { action, computed, flow, observable } from 'mobx'
import type { RootStore } from '../../Store'
import { SaladError } from '../../axiosFactory'
import { isProblemDetail } from '../../utils'
import { NotificationMessageCategory } from '../notifications/models'
import {
  coinbaseEmailDisabledProblemType,
  coinbaseEmailEndpointPath,
  coinbaseEmailInvalidProblemType,
} from './constants'
import type { CoinbaseEmail } from './models'

export type CoinbaseEmailSubmitStatus = 'unknown' | 'loading' | 'success' | 'failure'

/** Why the most recent save failed: a bad format, the server switch being off, or anything else. */
export type CoinbaseEmailSubmitError = 'invalid' | 'disabled' | 'unknown'

/** Reads the problem `type` from a failed request, if the API returned one. */
const getProblemType = (err: unknown): string | undefined => {
  if (err instanceof SaladError) {
    return err.type
  }
  if (Axios.isAxiosError(err)) {
    const data: unknown = err.response?.data
    if (isProblemDetail(data)) {
      return data.type
    }
  }
  return undefined
}

/**
 * Owns the Coinbase account email the Chef has entered for Coinbase cash-outs.
 *
 * Whether Coinbase cash-out is available to this Chef comes from the server with the email, in `enabled`. Until the
 * email has loaded, or if loading fails, the feature counts as unavailable and saving or clearing the email does
 * nothing.
 */
export class CoinbaseEmailStore {
  /** The Chef's currently saved Coinbase account email, if any, as returned by the server. */
  @observable
  public email?: string

  /** Whether Coinbase cash-out is available to this Chef, as the server last said. */
  @observable
  public isEnabled: boolean = false

  /** Whether the initial `GET` of the email is in flight. */
  @observable
  public isLoading: boolean = false

  /** Whether the most recent load failed. */
  @observable
  public isLoadError: boolean = false

  /** Status of the most recent set/clear mutation. */
  @observable
  public submitStatus: CoinbaseEmailSubmitStatus = 'unknown'

  /** Why the most recent set/clear mutation failed, if it did. */
  @observable
  public submitError?: CoinbaseEmailSubmitError

  /**
   * @param store The root store.
   * @param axios The App API client.
   */
  constructor(private readonly store: RootStore, private readonly axios: AxiosInstance) {}

  @computed
  public get hasEmail(): boolean {
    return !!this.email
  }

  @action.bound
  public setSubmitStatus = (submitStatus: CoinbaseEmailSubmitStatus) => {
    this.submitStatus = submitStatus
    if (submitStatus !== 'failure') {
      this.submitError = undefined
    }
  }

  /** Fetches the saved email and whether Coinbase cash-out is available to this Chef. */
  @action.bound
  public loadEmail = flow(function* (this: CoinbaseEmailStore) {
    this.isLoading = true
    this.isLoadError = false
    try {
      const response: AxiosResponse<CoinbaseEmail> = yield this.axios.get(coinbaseEmailEndpointPath)
      this.email = response.data?.email || undefined
      this.isEnabled = response.data?.enabled === true
    } catch (err) {
      this.isLoadError = true
      this.email = undefined
      this.isEnabled = false
    } finally {
      this.isLoading = false
    }
  })

  /** Sets or changes the saved email. No-ops unless Coinbase cash-out is available to this Chef. */
  @action.bound
  public setEmail = flow(function* (this: CoinbaseEmailStore, email: string) {
    if (!this.isEnabled || this.submitStatus === 'loading') {
      return
    }
    this.submitStatus = 'loading'
    this.submitError = undefined
    try {
      const response: AxiosResponse<CoinbaseEmail> = yield this.axios.put(coinbaseEmailEndpointPath, { email })
      // The server trims the email before saving it, so show what it returns rather than what was typed.
      this.email = response.data?.email ?? email
      this.submitStatus = 'success'
    } catch (err) {
      const problemType = getProblemType(err)
      this.submitStatus = 'failure'
      if (problemType === coinbaseEmailDisabledProblemType) {
        this.submitError = 'disabled'
        this.store.notifications.sendNotification({
          category: NotificationMessageCategory.FurtherActionRequired,
          title: 'Coinbase email settings are not available yet',
          message: 'Your Coinbase email was not saved. Please try again later.',
          autoClose: false,
          type: 'error',
        })
      } else if (problemType === coinbaseEmailInvalidProblemType) {
        this.submitError = 'invalid'
        this.store.notifications.sendNotification({
          category: NotificationMessageCategory.FurtherActionRequired,
          title: 'Unable to save your Coinbase email',
          message: 'That email address is not in a valid format. Please check it and try again.',
          autoClose: false,
          type: 'error',
        })
      } else {
        this.submitError = 'unknown'
        this.store.notifications.sendNotification({
          category: NotificationMessageCategory.FurtherActionRequired,
          title: 'Unable to save your Coinbase email',
          message: 'Please try again.',
          autoClose: false,
          type: 'error',
        })
      }
    }
  })

  /** Clears the saved email. No-ops unless Coinbase cash-out is available to this Chef. */
  @action.bound
  public clearEmail = flow(function* (this: CoinbaseEmailStore) {
    if (!this.isEnabled || this.submitStatus === 'loading') {
      return
    }
    this.submitStatus = 'loading'
    this.submitError = undefined
    try {
      yield this.axios.delete(coinbaseEmailEndpointPath)
      this.email = undefined
      this.submitStatus = 'success'
    } catch (err) {
      this.submitStatus = 'failure'
      this.submitError = 'unknown'
      this.store.notifications.sendNotification({
        category: NotificationMessageCategory.FurtherActionRequired,
        title: 'Unable to remove your Coinbase email',
        message: 'Please try again.',
        autoClose: false,
        type: 'error',
      })
    }
  })
}
