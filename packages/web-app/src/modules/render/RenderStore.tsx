import { action, observable } from 'mobx'
import type { RenderExchangeRate } from './models'
import { isExchangeRateStale } from './utils'

/**
 * Holds the live RENDER/USD price quote. The quote query (`RenderPriceQuoteContainer`) fetches it and puts it here, so
 * the quote shown and the one redemption sends (`RewardStore.redeemReward`) are the same.
 */
export class RenderStore {
  @observable
  public exchangeRate?: RenderExchangeRate = undefined

  /** Whether the currently held quote should be treated as stale. */
  public get isExchangeRateStale(): boolean {
    return isExchangeRateStale(this.exchangeRate)
  }

  /** Holds a newly fetched quote. */
  @action.bound
  public setExchangeRate(exchangeRate: RenderExchangeRate): void {
    this.exchangeRate = exchangeRate
  }
}
