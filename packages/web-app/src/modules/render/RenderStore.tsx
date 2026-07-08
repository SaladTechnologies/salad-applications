import type { AxiosInstance, AxiosResponse } from 'axios'
import { action, flow, observable } from 'mobx'
import { renderExchangeRateEndpointPath, renderExchangeRateRefreshRate } from './constants'
import type { RenderExchangeRate, RenderExchangeRateResource } from './models'
import { isExchangeRateStale, renderExchangeRateFromResource } from './utils'

/**
 * Owns the live RENDER/USD price quote that powers the price-quote feature.
 */
export class RenderStore {
  @observable
  public exchangeRate?: RenderExchangeRate = undefined

  @observable
  public isLoadingExchangeRate: boolean = false

  @observable
  public hasExchangeRateError: boolean = false

  private pollingHandle?: ReturnType<typeof setInterval>
  private activeViewers: number = 0

  /**
   * @param axios The App API client.
   */
  public constructor(private readonly axios: AxiosInstance) {}

  /** Whether the currently held quote should be treated as stale. */
  public get isExchangeRateStale(): boolean {
    return isExchangeRateStale(this.exchangeRate)
  }

  /**
   * Registers a RENDER reward view as active and begins polling for fresh quotes.
   *
   * Reference-counted so multiple simultaneous views (e.g. reward detail and checkout) share a single poll loop.
   */
  @action.bound
  public startPollingExchangeRate(): void {
    this.activeViewers += 1

    if (this.pollingHandle !== undefined) {
      return
    }

    this.fetchExchangeRate()
    this.pollingHandle = setInterval(() => {
      this.fetchExchangeRate()
    }, renderExchangeRateRefreshRate)
  }

  /** De-registers a RENDER reward view and stops polling once no views remain active. */
  @action.bound
  public stopPollingExchangeRate(): void {
    if (this.activeViewers > 0) {
      this.activeViewers -= 1
    }

    if (this.activeViewers === 0 && this.pollingHandle !== undefined) {
      clearInterval(this.pollingHandle)
      this.pollingHandle = undefined
    }
  }

  /** Fetches the current RENDER/USD quote. */
  @action.bound
  public fetchExchangeRate = flow(function* (this: RenderStore) {
    this.isLoadingExchangeRate = true
    this.hasExchangeRateError = false

    try {
      const response: AxiosResponse<RenderExchangeRateResource> = yield this.axios.get(renderExchangeRateEndpointPath)
      this.exchangeRate = renderExchangeRateFromResource(response.data, new Date())
    } catch (error) {
      this.hasExchangeRateError = true
      console.error('RenderStore -> fetchExchangeRate: ', error)
    } finally {
      this.isLoadingExchangeRate = false
    }
  })
}
