import type { ExternalState } from '../../app/external-state.ts'
import { createExternalState } from '../../app/external-state.ts'
import type { RenderExchangeRate } from './models'
import { isExchangeRateStale } from './utils'

/** The RENDER/USD quote held, which the quote reads with `useExternalState`. */
export interface RenderState {
  /** The latest quote, or none before the first load. */
  exchangeRate: RenderExchangeRate | undefined
}

/**
 * Holds the live RENDER/USD price quote. The quote query (`RenderPriceQuoteContainer`) fetches it and puts it here, so
 * the quote shown and the one redemption sends (`RewardStore.redeemReward`) are the same.
 */
export class RenderStore {
  /** The quote. A change makes a new state. */
  public readonly state: ExternalState<RenderState> = createExternalState<RenderState>({ exchangeRate: undefined })

  /** The quote held now, which redemption sends. */
  public get exchangeRate(): RenderExchangeRate | undefined {
    return this.state.get().exchangeRate
  }

  /** Whether the currently held quote should be treated as stale. */
  public get isExchangeRateStale(): boolean {
    return isExchangeRateStale(this.exchangeRate)
  }

  /** Holds a newly fetched quote. */
  public setExchangeRate = (exchangeRate: RenderExchangeRate): void => {
    this.state.update({ exchangeRate })
  }
}
